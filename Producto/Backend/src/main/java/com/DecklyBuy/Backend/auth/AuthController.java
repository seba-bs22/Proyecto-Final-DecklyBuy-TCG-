package com.DecklyBuy.Backend.auth;

import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.users.UserRepository;
import com.DecklyBuy.Backend.users.UserResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "https://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationService verificationService;
    private final EmailService emailService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          VerificationService verificationService,
                          EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.verificationService = verificationService;
        this.emailService = emailService;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private User crearYGuardarUsuario(RegisterRequest request) {
        User user = new User();
        user.setNombre(request.nombre().trim());
        user.setApellido(request.apellido() != null ? request.apellido().trim() : null);
        user.setNombreUsuario(request.nombreUsuario().trim().toLowerCase().replaceAll("\\s+", ""));
        user.setNumeroContacto(request.numeroContacto() != null ? request.numeroContacto().trim() : null);
        user.setEmail(request.email().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setAuthProvider("LOCAL");
        user.setPerfilCompleto(true);
        user.setRol("USER");
        user.setEstadoCuenta("ACTIVE");

        OffsetDateTime now = OffsetDateTime.now();
        user.setFechaCreacion(now);
        user.setFechaActualizacion(now);

        return userRepository.save(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (isBlank(request.nombre()) || isBlank(request.nombreUsuario()) ||
            isBlank(request.email()) || isBlank(request.password()) || isBlank(request.confirmPassword())) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Debes completar todos los campos obligatorios."));
        }

        if (!request.password().equals(request.confirmPassword())) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Las contraseñas no coinciden."));
        }

        if (request.password().length() < 6) {
            return ResponseEntity.badRequest().body(AuthResponse.error("La contraseña debe tener al menos 6 caracteres."));
        }

        String email = request.email().trim().toLowerCase();
        String nombreUsuario = request.nombreUsuario().trim().toLowerCase().replaceAll("\\s+", "");

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(AuthResponse.error("El correo ya está registrado."));
        }

        if (userRepository.existsByNombreUsuario(nombreUsuario)) {
            return ResponseEntity.badRequest().body(AuthResponse.error("El nombre de usuario ya está en uso."));
        }

        User savedUser = crearYGuardarUsuario(request);
        return ResponseEntity.ok(AuthResponse.ok("Usuario registrado correctamente.", new UserResponse(savedUser)));
    }

    @PostMapping("/register-init")
    public ResponseEntity<?> registerInit(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (isBlank(email)) {
            return ResponseEntity.badRequest().body(AuthResponse.error("El correo es requerido."));
        }
        
        String cleanEmail = email.trim().toLowerCase();
        String code = String.valueOf(new Random().nextInt(900000) + 100000);

        verificationService.saveCode(cleanEmail, code);
        emailService.sendVerificationCode(cleanEmail, code);

        return ResponseEntity.ok(AuthResponse.ok("Código enviado con éxito.", null));
    }

    @PostMapping("/register-verify")
    public ResponseEntity<?> registerVerify(@RequestBody RegisterRequest request) {
        String emailClean = request.email() != null ? request.email().trim().toLowerCase() : "";
        
        boolean valid = verificationService.checkCode(emailClean, request.code());
        if (!valid) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Código inválido o expirado."));
        }

        User savedUser = crearYGuardarUsuario(request);
        return ResponseEntity.ok(AuthResponse.ok("Usuario registrado y verificado correctamente.", new UserResponse(savedUser)));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        if (isBlank(request.email()) || isBlank(request.password())) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Debes ingresar correo y contraseña."));
        }

        String email = request.email().trim().toLowerCase();

        return userRepository.findByEmail(email)
                .map(user -> {
                    if (user.getPasswordHash() == null) {
                        return ResponseEntity.badRequest().body(AuthResponse.error("Este usuario no tiene contraseña local. Intenta iniciar sesión con Google."));
                    }

                    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.error("Correo o contraseña incorrectos."));
                    }

                    if (!"ACTIVE".equals(user.getEstadoCuenta())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(AuthResponse.error("La cuenta no se encuentra activa."));
                    }

                    HttpSession session = httpRequest.getSession(true);
                    session.setAttribute("AUTH_USER_ID", user.getId());

                    return ResponseEntity.ok(AuthResponse.ok("Login correcto.", new UserResponse(user)));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.error("Correo o contraseña incorrectos.")));
    }
    
    @PostMapping("/login-init")
    public ResponseEntity<?> loginInit(@RequestBody LoginRequest request) {
        if (isBlank(request.email()) || isBlank(request.password())) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Debes ingresar correo y contraseña."));
        }

        String email = request.email().trim().toLowerCase();

        return userRepository.findByEmail(email)
                .map(user -> {
                    if (user.getPasswordHash() == null) {
                        return ResponseEntity.badRequest().body(AuthResponse.error("Esta cuenta no dispone de una contraseña local configurada. Por favor, inicie sesión con Google."));
                    }

                    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.error("Correo o contraseña incorrectos."));
                    }

                    String code = String.valueOf(new Random().nextInt(900000) + 100000);
                    verificationService.saveCode(email, code);
                    emailService.sendVerificationCode(email, code);

                    return ResponseEntity.ok(AuthResponse.ok("Código de verificación enviado.", null));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.error("Correo o contraseña incorrectos.")));
    }

    @PostMapping("/login-verify")
    public ResponseEntity<?> loginVerify(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        String email = request.get("email").trim().toLowerCase();
        String password = request.get("password");
        String code = request.get("code");

        return userRepository.findByEmail(email)
                .map(user -> {
                    if (user.getPasswordHash() == null) {
                        return ResponseEntity.badRequest().body(AuthResponse.error("Acceso inválido."));
                    }

                    if (!passwordEncoder.matches(password, user.getPasswordHash())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.error("Correo o contraseña incorrectos."));
                    }

                    if (!verificationService.checkCode(email, code)) {
                        return ResponseEntity.badRequest().body(AuthResponse.error("Código inválido o expirado."));
                    }

                    HttpSession session = httpRequest.getSession(true);
                    session.setAttribute("AUTH_USER_ID", user.getId());

                    UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(user.getEmail(), null, new ArrayList<>());
                    SecurityContextHolder.getContext().setAuthentication(auth);

                    return ResponseEntity.ok(AuthResponse.ok("Login correcto.", new UserResponse(user)));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.error("Correo o contraseña incorrectos.")));
    }

    @GetMapping({"/me", "/session"})
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.error("No hay sesión activa."));
        }

        Object userIdObj = session.getAttribute("AUTH_USER_ID");
        if (userIdObj == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.error("No hay sesión activa."));
        }
        UUID userId = (UUID) userIdObj;
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(AuthResponse.ok("Usuario actual.", new UserResponse(user))))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(AuthResponse.error("Usuario no encontrado.")));
    }

    @PutMapping("/complete-profile")
    public ResponseEntity<?> completeProfile(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.error("No autorizado."));
        }

        String nombre = request.get("nombre");
        String apellido = request.get("apellido");
        String nombreUsuario = request.get("nombreUsuario");
        String contacto = request.get("contacto");

        if (isBlank(nombre) || isBlank(apellido) || isBlank(nombreUsuario)) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Todos los campos son obligatorios."));
        }

        String usernameClean = nombreUsuario.trim().toLowerCase().replaceAll("\\s+", "");

        Object userIdObj = session.getAttribute("AUTH_USER_ID");
        if (userIdObj == null || !(userIdObj instanceof UUID)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponse.error("Sesión inválida."));
        }
        UUID userId = (UUID) userIdObj;
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(AuthResponse.error("Usuario no encontrado."));
        }

        if (!usernameClean.equals(user.getNombreUsuario()) && userRepository.existsByNombreUsuario(usernameClean)) {
            return ResponseEntity.badRequest().body(AuthResponse.error("El nombre de usuario ya está en uso."));
        }

        user.setNombre(nombre.trim());
        user.setApellido(apellido.trim());
        user.setNombreUsuario(usernameClean);
        user.setNumeroContacto(contacto != null && !contacto.trim().isEmpty() ? contacto.trim() : null);
        user.setFechaActualizacion(OffsetDateTime.now());
        user.setPerfilCompleto(true);

        User updatedUser = userRepository.save(user);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(updatedUser.getEmail(), null, new ArrayList<>());
        SecurityContextHolder.getContext().setAuthentication(auth);

        return ResponseEntity.ok(AuthResponse.ok("Perfil completado correctamente.", new UserResponse(updatedUser)));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(AuthResponse.ok("Sesión cerrada correctamente.", null));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (isBlank(email)) {
            return ResponseEntity.badRequest().body(AuthResponse.error("El correo es requerido."));
        }

        return userRepository.findByEmail(email.trim().toLowerCase())
                .map(user -> {
                    String token = UUID.randomUUID().toString();
                    user.setResetToken(token);
                    user.setResetTokenExpiry(OffsetDateTime.now().plusHours(1));
                    userRepository.save(user);

                    String resetLink = "https://localhost:5173/reset-password/" + token;
                    emailService.sendEmail(user.getEmail(), "Recupera tu contraseña",
                            "Haz clic en el siguiente enlace para restablecer tu contraseña: " + resetLink);

                    return ResponseEntity.ok(AuthResponse.ok("Correo de recuperación enviado.", null));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(AuthResponse.error("Usuario no encontrado.")));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (isBlank(token) || isBlank(newPassword)) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Token y nueva contraseña requeridos."));
        }

        return userRepository.findByResetToken(token)
                .map(user -> {
                    if (user.getResetTokenExpiry().isBefore(OffsetDateTime.now())) {
                        return ResponseEntity.badRequest().body(AuthResponse.error("El token ha expirado."));
                    }

                    user.setPasswordHash(passwordEncoder.encode(newPassword));
                    user.setResetToken(null);
                    user.setResetTokenExpiry(null);
                    userRepository.save(user);

                    return ResponseEntity.ok(AuthResponse.ok("Contraseña restablecida correctamente.", null));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body(AuthResponse.error("Token inválido.")));
    }
}