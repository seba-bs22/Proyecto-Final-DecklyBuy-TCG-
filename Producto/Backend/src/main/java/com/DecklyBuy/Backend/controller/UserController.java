package com.DecklyBuy.Backend.controller;

import com.DecklyBuy.Backend.users.UserResponse;
import com.DecklyBuy.Backend.users.UserRepository;
import com.DecklyBuy.Backend.users.ProfileUpdateRequest;
import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.users.ApiResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.OffsetDateTime;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Endpoint unificado para obtener usuario autenticado
    @GetMapping("/user")
    public ResponseEntity<?> getUser(
            @AuthenticationPrincipal OAuth2User principal,
            HttpServletRequest request
    ) {
        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("No hay sesión activa.", null));
        }

        UUID userId = (UUID) session.getAttribute("AUTH_USER_ID");
        return userRepository.findById(userId)
                .map(UserResponse::new)
                .map(user -> ResponseEntity.ok(new ApiResponse("Usuario actual.", user)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("Usuario no encontrado.", null)));
    }

    // Obtener todos los usuarios
    @GetMapping("/api/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .toList();

        return ResponseEntity.ok(users);
    }

    // Obtener usuario por id
    @GetMapping("/api/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(UserResponse::new)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Obtener usuario por email
    @GetMapping("/api/users/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(UserResponse::new)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Actualizar perfil
    @PutMapping("/api/users/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody ProfileUpdateRequest request,
            HttpServletRequest httpRequest
    ) {
        HttpSession session = httpRequest.getSession(false);

        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse("No hay sesión activa.", null));
        }

        UUID userId = (UUID) session.getAttribute("AUTH_USER_ID");
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse("Usuario no encontrado.", null));
        }

        if (isBlank(request.getNombre()) || isBlank(request.getNombreUsuario())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Nombre y nombre de usuario son obligatorios.", null));
        }

        String nuevoNombreUsuario = request.getNombreUsuario().trim();

        if (!nuevoNombreUsuario.equals(user.getNombreUsuario())
                && userRepository.existsByNombreUsuario(nuevoNombreUsuario)) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El nombre de usuario ya está en uso.", null));
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
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("Las contraseñas no coinciden.", null));
            }

            if (request.getPassword().length() < 6) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("La contraseña debe tener al menos 6 caracteres.", null));
            }

            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

            if ("GOOGLE".equals(user.getAuthProvider())) {
                user.setAuthProvider("LOCAL_GOOGLE");
            }
        }

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(
                new ApiResponse("Perfil actualizado correctamente.", new UserResponse(savedUser))
        );
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
