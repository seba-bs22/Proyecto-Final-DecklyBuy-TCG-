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

/**
 * Controlador REST para gestión de usuarios.
 * Incluye endpoints para obtener y actualizar perfiles.
 */
@RestController
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Obtener usuario autenticado
    @GetMapping("/user")
    public ResponseEntity<ApiResponse> getUser(
            @AuthenticationPrincipal OAuth2User principal,
            HttpServletRequest request
    ) {
        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("No hay sesión activa.", null));
        }

        Object attr = session.getAttribute("AUTH_USER_ID");
        if (!(attr instanceof UUID userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Sesión inválida.", null));
        }

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
    public ResponseEntity<ApiResponse> getUserById(@PathVariable UUID id) {
        if (id == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("ID de usuario inválido.", null));
        }

        return userRepository.findById(id)
                .map(UserResponse::new)
                .map(user -> ResponseEntity.ok(new ApiResponse("Usuario encontrado.", user)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("Usuario no encontrado.", null)));
    }

    // Obtener usuario por email
    @GetMapping("/api/users/email/{email}")
    public ResponseEntity<ApiResponse> getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .map(UserResponse::new)
                .map(user -> ResponseEntity.ok(new ApiResponse("Usuario encontrado.", user)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("Usuario no encontrado.", null)));
    }

    // Actualizar perfil
    @PutMapping("/api/users/profile")
    public ResponseEntity<ApiResponse> updateProfile(
            @RequestBody ProfileUpdateRequest request,
            HttpServletRequest httpRequest
    ) {
        HttpSession session = httpRequest.getSession(false);

        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("No hay sesión activa.", null));
        }

        Object attr = session.getAttribute("AUTH_USER_ID");
        if (!(attr instanceof UUID userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Sesión inválida.", null));
        }

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("Usuario no encontrado.", null));
        }

        if (isBlank(request.nombre()) || isBlank(request.nombreUsuario())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Nombre y nombre de usuario son obligatorios.", null));
        }

        String nuevoNombreUsuario = request.nombreUsuario().trim();

        if (!nuevoNombreUsuario.equals(user.getNombreUsuario())
                && userRepository.existsByNombreUsuario(nuevoNombreUsuario)) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El nombre de usuario ya está en uso.", null));
        }

        user.setNombre(request.nombre().trim());
        user.setApellido(request.apellido() != null ? request.apellido().trim() : null);
        user.setNombreUsuario(nuevoNombreUsuario);
        user.setNumeroContacto(request.numeroContacto() != null ? request.numeroContacto().trim() : null);
        user.setPerfilCompleto(true);
        user.setFechaActualizacion(OffsetDateTime.now());

        boolean quiereCambiarPassword =
                request.password() != null && !request.password().trim().isEmpty();

        if (quiereCambiarPassword) {
            // 🚫 Bloqueo: si la cuenta es de Google, no permitir cambio de contraseña
            if ("GOOGLE".equals(user.getAuthProvider()) || user.getGoogleId() != null) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("Las cuentas vinculadas a Google no pueden cambiar contraseña.", null));
            }

            if (!request.password().equals(request.confirmPassword())) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("Las contraseñas no coinciden.", null));
            }

            if (request.password().length() < 6) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse("La contraseña debe tener al menos 6 caracteres.", null));
            }

            user.setPasswordHash(passwordEncoder.encode(request.password()));
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
