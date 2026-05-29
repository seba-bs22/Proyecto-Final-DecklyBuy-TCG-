package com.DecklyBuy.Backend.auth;

import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.users.UserRepository;
import com.DecklyBuy.Backend.users.UserResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

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

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}