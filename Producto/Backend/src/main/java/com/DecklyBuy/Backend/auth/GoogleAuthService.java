package com.DecklyBuy.Backend.auth;

import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.users.UserRepository;
import com.DecklyBuy.Backend.users.UserResponse;

import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class GoogleAuthService {

    private final UserRepository userRepository;

    public GoogleAuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse processGoogleUser(OAuth2User oauthUser) {

        String googleId = oauthUser.getAttribute("sub");
        String name = oauthUser.getAttribute("name");
        String email = oauthUser.getAttribute("email");
        String picture = oauthUser.getAttribute("picture");

        if (email == null || email.isBlank()) {
            throw new RuntimeException("Google no devolvió un correo válido.");
        }

        String normalizedEmail = email.trim().toLowerCase();

        Optional<User> existingByGoogleId = userRepository.findByGoogleId(googleId);
        Optional<User> existingByEmail = userRepository.findByEmail(normalizedEmail);

        User user;

        if (existingByGoogleId.isPresent()) {
            user = existingByGoogleId.get();

            user.setNombre(name);
            user.setEmail(normalizedEmail);
            user.setFotoPerfil(picture);
            user.setFechaActualizacion(OffsetDateTime.now());

        } else if (existingByEmail.isPresent()) {
            user = existingByEmail.get();

            user.setGoogleId(googleId);
            user.setNombre(name);
            user.setEmail(normalizedEmail);
            user.setFotoPerfil(picture);

            if ("LOCAL".equals(user.getAuthProvider())) {
                user.setAuthProvider("LOCAL_GOOGLE");
            } else {
                user.setAuthProvider("GOOGLE");
            }

            user.setFechaActualizacion(OffsetDateTime.now());

        } else {
            OffsetDateTime now = OffsetDateTime.now();

            user = new User();
            user.setId(UUID.randomUUID());
            user.setGoogleId(googleId);
            user.setNombre(name);
            user.setApellido(null);
            user.setNombreUsuario(null);
            user.setNumeroContacto(null);
            user.setEmail(normalizedEmail);
            user.setPasswordHash(null);
            user.setFotoPerfil(picture);
            user.setAuthProvider("GOOGLE");
            user.setPerfilCompleto(false);
            user.setRol("USER");
            user.setEstadoCuenta("ACTIVE");
            user.setFechaCreacion(now);
            user.setFechaActualizacion(now);
        }

        User savedUser = userRepository.save(user);

        return new UserResponse(savedUser);
    }
}