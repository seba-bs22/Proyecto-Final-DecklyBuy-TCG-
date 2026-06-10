package com.DecklyBuy.Backend.controller;

import com.DecklyBuy.Backend.users.ProfileUpdateRequest;
import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.users.UserRepository;
import com.DecklyBuy.Backend.users.UserResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Usuario google
    @GetMapping("/user")
    public Map<String, Object> getGoogleUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return null;
        }

        return principal.getAttributes();
    }

    // Usuarios supabase
    @GetMapping("/api/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .toList();

        return ResponseEntity.ok(users);
    }

    // Usuario por id
    @GetMapping("/api/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(UserResponse::new)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Usuario por email
    @GetMapping("/api/users/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(UserResponse::new)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/api/users/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody ProfileUpdateRequest request,
            HttpServletRequest httpRequest
    ) {
        HttpSession session = httpRequest.getSession(false);

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

        if (isBlank(request.getNombre()) || isBlank(request.getNombreUsuario())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Nombre y nombre de usuario son obligatorios.")
            );
        }

        String nuevoNombreUsuario = request.getNombreUsuario().trim();

        if (!nuevoNombreUsuario.equals(user.getNombreUsuario())
                && userRepository.existsByNombreUsuario(nuevoNombreUsuario)) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "El nombre de usuario ya está en uso.")
            );
        }

        user.setNombre(request.getNombre().trim());
        user.setApellido(request.getApellido() != null ? request.getApellido().trim() : null);
        user.setNombreUsuario(nuevoNombreUsuario);
        user.setNumeroContacto(request.getNumeroContacto() != null ? request.getNumeroContacto().trim() : null);
        user.setPerfilCompleto(true);
        user.setFechaActualizacion(OffsetDateTime.now());

        boolean quiereCambiarPassword =
                request.getPassword() != null && !request.getPassword().trim().isEmpty();

        if (quiereCambiarPassword) {
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

            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

            if ("GOOGLE".equals(user.getAuthProvider())) {
                user.setAuthProvider("LOCAL_GOOGLE");
            }
        }

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Perfil actualizado correctamente.",
                        "user", new UserResponse(savedUser)
                )
        );
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}