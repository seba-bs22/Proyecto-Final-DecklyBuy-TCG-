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

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
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
        if (isBlank(request.getNombre()) ||
            isBlank(request.getNombreUsuario()) ||
            isBlank(request.getEmail()) ||
            isBlank(request.getPassword()) ||
            isBlank(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(new AuthResponse("Debes completar todos los campos obligatorios.", null));
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(new AuthResponse("Las contraseñas no coinciden.", null));
        }

        if (request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(new AuthResponse("La contraseña debe tener al menos 6 caracteres.", null));
        }

        String email = request.getEmail().trim().toLowerCase();
        String nombreUsuario = request.getNombreUsuario().trim();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(new AuthResponse("El correo ya está registrado.", null));
        }

        if (userRepository.existsByNombreUsuario(nombreUsuario)) {
            return ResponseEntity.badRequest().body(new AuthResponse("El nombre de usuario ya está en uso.", null));
        }

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setNombre(request.getNombre().trim());
        user.setApellido(request.getApellido() != null ? request.getApellido().trim() : null);
        user.setNombreUsuario(nombreUsuario);
        user.setNumeroContacto(request.getNumeroContacto() != null ? request.getNumeroContacto().trim() : null);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setAuthProvider("LOCAL");
        user.setPerfilCompleto(true);
        user.setRol("USER");
        user.setEstadoCuenta("ACTIVE");

        OffsetDateTime now = OffsetDateTime.now();
        user.setFechaCreacion(now);
        user.setFechaActualizacion(now);

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse("Usuario registrado correctamente.", new UserResponse(savedUser)));
    }

    @PostMapping("/register-init")
    public ResponseEntity<?> registerInit(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = String.valueOf(new Random().nextInt(900000) + 100000);

        verificationService.saveCode(email, code);
        emailService.sendVerificationCode(email, code);

        return ResponseEntity.ok(new AuthResponse("Código enviado.", null));
    }

    @PostMapping("/register-verify")
    public ResponseEntity<?> registerVerify(@RequestBody RegisterRequest request) {
        boolean valid = verificationService.checkCode(request.getEmail(), request.getCode());
        if (!valid) {
            return ResponseEntity.badRequest().body(new AuthResponse("Código inválido.", null));
        }

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setNombre(request.getNombre().trim());
        user.setApellido(request.getApellido() != null ? request.getApellido().trim() : null);
        user.setNombreUsuario(request.getNombreUsuario().trim());
        user.setNumeroContacto(request.getNumeroContacto() != null ? request.getNumeroContacto().trim() : null);
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setAuthProvider("LOCAL");
        user.setPerfilCompleto(true);
        user.setRol("USER");
        user.setEstadoCuenta("ACTIVE");

        OffsetDateTime now = OffsetDateTime.now();
        user.setFechaCreacion(now);
        user.setFechaActualizacion(now);

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse("Usuario registrado correctamente.", new UserResponse(savedUser)));
    }

    // ------------------- LOGIN -------------------

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        if (isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            return ResponseEntity.badRequest().body(new AuthResponse("Debes ingresar correo y contraseña.", null));
        }

        String email = request.getEmail().trim().toLowerCase();

        return userRepository.findByEmail(email)
                .map(user -> {
                    if (user.getPasswordHash() == null) {
                        return ResponseEntity.badRequest().body(new AuthResponse("Este usuario no tiene contraseña local. Intenta iniciar sesión con Google.", null));
                    }

                    boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
                    if (!passwordMatches) {
                        return ResponseEntity.status(401).body(new AuthResponse("Correo o contraseña incorrectos.", null));
                    }

                    if (!"ACTIVE".equals(user.getEstadoCuenta())) {
                        return ResponseEntity.status(403).body(new AuthResponse("La cuenta no se encuentra activa.", null));
                    }

                    HttpSession session = httpRequest.getSession(true);
                    session.setAttribute("AUTH_USER_ID", user.getId());

                    return ResponseEntity.ok(new AuthResponse("Login correcto.", new UserResponse(user)));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(new AuthResponse("Correo o contraseña incorrectos.", null)));
    }

    @PostMapping("/login-init")
    public ResponseEntity<?> loginInit(@RequestBody LoginRequest request) {
        if (isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            return ResponseEntity.badRequest().body(new AuthResponse("Debes ingresar correo y contraseña.", null));
        }

        String email = request.getEmail().trim().toLowerCase();

        return userRepository.findByEmail(email)
                .map(user -> {
                    boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
                    if (!passwordMatches) {
                        return ResponseEntity.status(401).body(new AuthResponse("Correo o contraseña incorrectos.", null));
                    }

                    String code = String.valueOf(new Random().nextInt(900000) + 100000);
                    verificationService.saveCode(email, code);
                    emailService.sendVerificationCode(email, code);

                    return ResponseEntity.ok(new AuthResponse("Código enviado.", null));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(new AuthResponse("Correo o contraseña incorrectos.", null)));
    }

    @PostMapping("/login-verify")
    public ResponseEntity<?> loginVerify(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        String email = request.get("email").trim().toLowerCase();
        String password = request.get("password");
        String code = request.get("code");

        return userRepository.findByEmail(email)
                .map(user -> {
                    boolean passwordMatches = passwordEncoder.matches(password, user.getPasswordHash());
                    if (!passwordMatches) {
                        return ResponseEntity.status(401).body(new AuthResponse("Correo o contraseña incorrectos.", null));
                    }

                    boolean valid = verificationService.checkCode(email, code);
                    if (!valid) {
                        return ResponseEntity.badRequest().body(new AuthResponse("Código inválido.", null));
                    }

                    HttpSession session = httpRequest.getSession(true);
                    session.setAttribute("AUTH_USER_ID", user.getId());

                    return ResponseEntity.ok(new AuthResponse("Login correcto.", new UserResponse(user)));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(new AuthResponse("Correo o contraseña incorrectos.", null)));
    }

    // ------------------- SESIÓN -------------------

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(401).body(new AuthResponse("No hay sesión activa.", null));
        }

        UUID userId = (UUID) session.getAttribute("AUTH_USER_ID");
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body(new AuthResponse("Usuario no encontrado.", null));
        }

        return ResponseEntity.ok(new AuthResponse("Usuario actual.", new UserResponse(user)));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new AuthResponse("Sesión cerrada correctamente.", null));
    }

    // ------------------- RECUPERACIÓN DE CONTRASEÑA -------------------

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(new AuthResponse("Correo requerido.", null));
        }

        User user = userRepository.findByEmail(email.trim().toLowerCase()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(new AuthResponse("Usuario no encontrado.", null));
        }

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(OffsetDateTime.now().plusHours(1));
        userRepository.save(user);

        String resetLink = "http://localhost:5173/reset-password/" + token;
        emailService.sendEmail(user.getEmail(), "Recupera tu contraseña",
            "Haz clic en el siguiente enlace para restablecer tu contraseña: " + resetLink);

        return ResponseEntity.ok(new AuthResponse("Correo de recuperación enviado.", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(new AuthResponse("Token y nueva contraseña requeridos.", null));
        }

        User user = userRepository.findByResetToken(token).orElse(null);
        if (user == null || user.getResetTokenExpiry().isBefore(OffsetDateTime.now())) {
            return ResponseEntity.status(400).body(new AuthResponse("Token inválido o expirado.", null));
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse("Contraseña restablecida correctamente.", null));
    }
}
