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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (isBlank(request.getNombre()) ||
                isBlank(request.getNombreUsuario()) ||
                isBlank(request.getEmail()) ||
                isBlank(request.getPassword()) ||
                isBlank(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Debes completar todos los campos obligatorios.")
            );
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Las contraseñas no coinciden.")
            );
        }

        if (request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "La contraseña debe tener al menos 6 caracteres.")
            );
        }

        String email = request.getEmail().trim().toLowerCase();
        String nombreUsuario = request.getNombreUsuario().trim();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "El correo ya está registrado.")
            );
        }

        if (userRepository.existsByNombreUsuario(nombreUsuario)) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "El nombre de usuario ya está en uso.")
            );
        }

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setNombre(request.getNombre().trim());
        user.setApellido(request.getApellido() != null ? request.getApellido().trim() : null);
        user.setNombreUsuario(nombreUsuario);
        user.setNumeroContacto(request.getNumeroContacto() != null ? request.getNumeroContacto().trim() : null);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFotoPerfil(null);
        user.setGoogleId(null);
        user.setAuthProvider("LOCAL");
        user.setPerfilCompleto(true);
        user.setRol("USER");
        user.setEstadoCuenta("ACTIVE");

        OffsetDateTime now = OffsetDateTime.now();
        user.setFechaCreacion(now);
        user.setFechaActualizacion(now);

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(
                new AuthResponse(
                        "Usuario registrado correctamente.",
                        new UserResponse(savedUser)
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {
        if (isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Debes ingresar correo y contraseña.")
            );
        }

        String email = request.getEmail().trim().toLowerCase();

        return userRepository.findByEmail(email)
                .map(user -> {
                    if (user.getPasswordHash() == null) {
                        return ResponseEntity.badRequest().body(
                                Map.of("message", "Este usuario no tiene contraseña local. Intenta iniciar sesión con Google.")
                        );
                    }

                    boolean passwordMatches = passwordEncoder.matches(
                            request.getPassword(),
                            user.getPasswordHash()
                    );

                    if (!passwordMatches) {
                        return ResponseEntity.status(401).body(
                                Map.of("message", "Correo o contraseña incorrectos.")
                        );
                    }

                    if (!"ACTIVE".equals(user.getEstadoCuenta())) {
                        return ResponseEntity.status(403).body(
                                Map.of("message", "La cuenta no se encuentra activa.")
                        );
                    }

                    HttpSession session = httpRequest.getSession(true);
                    session.setAttribute("AUTH_USER_ID", user.getId());

                    return ResponseEntity.ok(
                            new AuthResponse(
                                    "Login correcto.",
                                    new UserResponse(user)
                            )
                    );
                })
                .orElseGet(() -> ResponseEntity.status(401).body(
                        Map.of("message", "Correo o contraseña incorrectos.")
                ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "No hay sesión activa.")
            );
        }

        UUID userId = (UUID) session.getAttribute("AUTH_USER_ID");

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body(
                    Map.of("message", "Usuario no encontrado.")
            );
        }

        return ResponseEntity.ok(new UserResponse(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(
                Map.of("message", "Sesión cerrada correctamente.")
        );
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    @PostMapping("/register-init")
    public ResponseEntity<?> registerInit(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = String.valueOf(new Random().nextInt(900000) + 100000);

        verificationService.saveCode(email, code);
        emailService.sendVerificationCode(email, code);

        return ResponseEntity.ok(Map.of("message", "Código enviado"));
    }

    @PostMapping("/register-verify")
    public ResponseEntity<?> registerVerify(@RequestBody RegisterRequest request) {
        boolean valid = verificationService.checkCode(request.getEmail(), request.getCode());

        if (!valid) {
            return ResponseEntity.badRequest().body(Map.of("message", "Código inválido"));
        }

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setNombre(request.getNombre().trim());
        user.setApellido(request.getApellido() != null ? request.getApellido().trim() : null);
        user.setNombreUsuario(request.getNombreUsuario().trim());
        user.setNumeroContacto(request.getNumeroContacto() != null ? request.getNumeroContacto().trim() : null);
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFotoPerfil(null);
        user.setGoogleId(null);
        user.setAuthProvider("LOCAL");
        user.setPerfilCompleto(true);
        user.setRol("USER");
        user.setEstadoCuenta("ACTIVE");

        OffsetDateTime now = OffsetDateTime.now();
        user.setFechaCreacion(now);
        user.setFechaActualizacion(now);

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(
                new AuthResponse("Usuario registrado correctamente.", new UserResponse(savedUser))
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Correo requerido"));
        }

        User user = userRepository.findByEmail(email.trim().toLowerCase()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Usuario no encontrado"));
        }

        // Generar token único
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(OffsetDateTime.now().plusHours(1));
        userRepository.save(user);

        // Enviar correo con enlace
        String resetLink = "http://localhost:5173/reset-password/" + token;
        emailService.sendEmail(user.getEmail(), "Recupera tu contraseña", 
            "Haz clic en el siguiente enlace para restablecer tu contraseña: " + resetLink);

        return ResponseEntity.ok(Map.of("message", "Correo de recuperación enviado"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token y nueva contraseña requeridos"));
        }

        User user = userRepository.findByResetToken(token).orElse(null);
        if (user == null || user.getResetTokenExpiry().isBefore(OffsetDateTime.now())) {
            return ResponseEntity.status(400).body(Map.of("message", "Token inválido o expirado"));
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Contraseña restablecida correctamente"));
    }

    @PostMapping("/login-init")
    public ResponseEntity<?> loginInit(@RequestBody LoginRequest request) {
        if (isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Debes ingresar correo y contraseña."));
        }

        String email = request.getEmail().trim().toLowerCase();

        return userRepository.findByEmail(email)
                .map(user -> {
                    boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
                    if (!passwordMatches) {
                        return ResponseEntity.status(401).body(Map.of("message", "Correo o contraseña incorrectos."));
                    }

                    // Generar código
                    String code = String.valueOf(new Random().nextInt(900000) + 100000);
                    verificationService.saveCode(email, code);

                    // Enviar correo
                    emailService.sendVerificationCode(email, code);

                    return ResponseEntity.ok(Map.of("message", "Código enviado"));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("message", "Correo o contraseña incorrectos.")));
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
                        return ResponseEntity.status(401).body(Map.of("message", "Correo o contraseña incorrectos."));
                    }

                    boolean valid = verificationService.checkCode(email, code);
                    if (!valid) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Código inválido"));
                    }

                    HttpSession session = httpRequest.getSession(true);
                    session.setAttribute("AUTH_USER_ID", user.getId());

                    return ResponseEntity.ok(new AuthResponse("Login correcto.", new UserResponse(user)));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("message", "Correo o contraseña incorrectos.")));
    }
}
