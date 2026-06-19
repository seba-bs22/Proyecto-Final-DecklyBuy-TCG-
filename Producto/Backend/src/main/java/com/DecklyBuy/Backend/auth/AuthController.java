package com.DecklyBuy.Backend.auth;

import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.users.UserRepository;
import com.DecklyBuy.Backend.users.UserResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

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

    // ------------------- REGISTRO -------------------

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (isBlank(request.nombre()) ||
            isBlank(request.nombreUsuario()) ||
            isBlank(request.email()) ||
            isBlank(request.password()) ||
            isBlank(request.confirmPassword())) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Debes completar todos los campos obligatorios."));
        }

        if (!request.password().equals(request.confirmPassword())) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Las contraseñas no coinciden."));
        }

        if (request.password().length() < 6) {
            return ResponseEntity.badRequest().body(AuthResponse.error("La contraseña debe tener al menos 6 caracteres."));
        }

        String email = request.email().trim().toLowerCase();
        String nombreUsuario = request.nombreUsuario().trim();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(AuthResponse.error("El correo ya está registrado."));
        }

        if (userRepository.existsByNombreUsuario(nombreUsuario)) {
            return ResponseEntity.badRequest().body(AuthResponse.error("El nombre de usuario ya está en uso."));
        }

        User user = new User(); // el constructor ya asigna UUID
        user.setNombre(request.nombre().trim());
        user.setApellido(request.apellido() != null ? request.apellido().trim() : null);
        user.setNombreUsuario(nombreUsuario);
        user.setNumeroContacto(request.numeroContacto() != null ? request.numeroContacto().trim() : null);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setAuthProvider("LOCAL");
        user.setPerfilCompleto(true);
        user.setRol("USER");
        user.setEstadoCuenta("ACTIVE");

        OffsetDateTime now = OffsetDateTime.now();
        user.setFechaCreacion(now);
        user.setFechaActualizacion(now);

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(AuthResponse.ok("Usuario registrado correctamente.", new UserResponse(savedUser)));
    }

    @PostMapping("/register-init")
    public ResponseEntity<?> registerInit(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = String.valueOf(new Random().nextInt(900000) + 100000);

        verificationService.saveCode(email, code);
        emailService.sendVerificationCode(email, code);

        return ResponseEntity.ok(AuthResponse.ok("Código enviado.", null));
    }

    @PostMapping("/register-verify")
    public ResponseEntity<?> registerVerify(@RequestBody RegisterRequest request) {
        boolean valid = verificationService.checkCode(request.email(), request.code());
        if (!valid) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Código inválido."));
        }

        User user = new User(); // constructor asigna UUID
        user.setNombre(request.nombre().trim());
        user.setApellido(request.apellido() != null ? request.apellido().trim() : null);
        user.setNombreUsuario(request.nombreUsuario().trim());
        user.setNumeroContacto(request.numeroContacto() != null ? request.numeroContacto().trim() : null);
        user.setEmail(request.email().trim().toLowerCase());

        // 🔑 Cambio aquí: si no hay password, es flujo Google
        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
            user.setAuthProvider("LOCAL");
        } else {
            user.setPasswordHash(null);
            user.setAuthProvider("GOOGLE");
        }

        user.setPerfilCompleto(true);
        user.setRol("USER");
        user.setEstadoCuenta("ACTIVE");

        OffsetDateTime now = OffsetDateTime.now();
        user.setFechaCreacion(now);
        user.setFechaActualizacion(now);

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(AuthResponse.ok("Usuario registrado correctamente.", new UserResponse(savedUser)));
    }
    // ------------------- LOGIN -------------------

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

                    boolean passwordMatches = passwordEncoder.matches(request.password(), user.getPasswordHash());
                    if (!passwordMatches) {
                        return ResponseEntity.status(401).body(AuthResponse.error("Correo o contraseña incorrectos."));
                    }

                    if (!"ACTIVE".equals(user.getEstadoCuenta())) {
                        return ResponseEntity.status(403).body(AuthResponse.error("La cuenta no se encuentra activa."));
                    }

                    HttpSession session = httpRequest.getSession(true);
                    session.setAttribute("AUTH_USER_ID", user.getId()); // UUID

                    return ResponseEntity.ok(AuthResponse.ok("Login correcto.", new UserResponse(user)));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(AuthResponse.error("Correo o contraseña incorrectos.")));
    }

    @PostMapping("/login-init")
    public ResponseEntity<?> loginInit(@RequestBody LoginRequest request) {
        if (isBlank(request.email()) || isBlank(request.password())) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Debes ingresar correo y contraseña."));
        }

        String email = request.email().trim().toLowerCase();

        return userRepository.findByEmail(email)
                .map(user -> {
                    boolean passwordMatches = passwordEncoder.matches(request.password(), user.getPasswordHash());
                    if (!passwordMatches) {
                        return ResponseEntity.status(401).body(AuthResponse.error("Correo o contraseña incorrectos."));
                    }

                    String code = String.valueOf(new Random().nextInt(900000) + 100000);
                    verificationService.saveCode(email, code);
                    emailService.sendVerificationCode(email, code);

                    return ResponseEntity.ok(AuthResponse.ok("Código enviado.", null));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(AuthResponse.error("Correo o contraseña incorrectos.")));
    }

    @PostMapping("/login-verify")
    public ResponseEntity<?> loginVerify(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        String email = request.get("email").trim().toLowerCase();
        String password = request.get("password");
        String code = request.get("code");

        return userRepository.findByEmail(email)
                .map(user -> {
                    // 🔑 Cambio aquí: si es LOCAL, validar contraseña; si es GOOGLE, no
                    boolean passwordMatches = true;
                    if ("LOCAL".equals(user.getAuthProvider())) {
                        passwordMatches = passwordEncoder.matches(password, user.getPasswordHash());
                    }
                    if (!passwordMatches) {
                        return ResponseEntity.status(401).body(AuthResponse.error("Correo o contraseña incorrectos."));
                    }

                    boolean valid = verificationService.checkCode(email, code);
                    if (!valid) {
                        return ResponseEntity.badRequest().body(AuthResponse.error("Código inválido."));
                    }

                    HttpSession session = httpRequest.getSession(true);
                    session.setAttribute("AUTH_USER_ID", user.getId()); // UUID

                    UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(user.getEmail(), null, new ArrayList<>());
                    SecurityContextHolder.getContext().setAuthentication(auth);

                    return ResponseEntity.ok(AuthResponse.ok("Login correcto.", new UserResponse(user)));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(AuthResponse.error("Correo o contraseña incorrectos.")));
    }

        // ------------------- SESIÓN -------------------

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null) {
            return ResponseEntity.status(401).body(AuthResponse.error("No hay sesión activa."));
        }

        Object attr = session.getAttribute("AUTH_USER_ID");
        if (attr == null) {
            return ResponseEntity.status(401).body(AuthResponse.error("No hay sesión activa."));
        }

        UUID userId = (UUID) attr; // ahora validado
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body(AuthResponse.error("Usuario no encontrado."));
        }

        return ResponseEntity.ok(AuthResponse.ok("Usuario actual.", new UserResponse(user)));
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

    // ------------------- RECUPERACIÓN DE CONTRASEÑA -------------------

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Correo requerido."));
        }

        User user = userRepository.findByEmail(email.trim().toLowerCase()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(AuthResponse.error("Usuario no encontrado."));
        }

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(OffsetDateTime.now().plusHours(1));
        userRepository.save(user);

        String resetLink = "https://localhost:5173/reset-password/" + token;
        emailService.sendEmail(user.getEmail(), "Recupera tu contraseña",
            "Haz clic en el siguiente enlace para restablecer tu contraseña: " + resetLink);

        return ResponseEntity.ok(AuthResponse.ok("Correo de recuperación enviado.", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Token y nueva contraseña requeridos."));
        }

        User user = userRepository.findByResetToken(token).orElse(null);
        if (user == null || user.getResetTokenExpiry().isBefore(OffsetDateTime.now())) {
            return ResponseEntity.status(400).body(AuthResponse.error("Token inválido o expirado."));
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(AuthResponse.ok("Contraseña restablecida correctamente.", null));
    }
}
