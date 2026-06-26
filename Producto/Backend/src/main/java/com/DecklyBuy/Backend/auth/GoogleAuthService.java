package com.DecklyBuy.Backend.auth;

import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.users.UserRepository;
import com.DecklyBuy.Backend.users.UserResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
public class GoogleAuthService {

    private static final Logger log = LoggerFactory.getLogger(GoogleAuthService.class);
    private final UserRepository userRepository;

    public GoogleAuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public GoogleAuthResponse processGoogleUser(OAuth2User oauthUser) {
        log.info("Atributos recibidos de Google: {}", oauthUser.getAttributes());

        String googleId = oauthUser.getAttribute("sub");
        String name = oauthUser.getAttribute("name");
        String email = oauthUser.getAttribute("email");
        String picture = oauthUser.getAttribute("picture");

        if (googleId == null || googleId.isBlank()) {
            return GoogleAuthResponse.error("Error: Google no devolvió un ID válido");
        }
        if (email == null || email.isBlank()) {
            return GoogleAuthResponse.error("Error: Google no devolvió un correo válido");
        }

        String normalizedEmail = email.trim().toLowerCase();
        Optional<User> existingByGoogleId = userRepository.findByGoogleId(googleId);
        Optional<User> existingByEmail = userRepository.findByEmail(normalizedEmail);

        if (existingByGoogleId.isPresent() || existingByEmail.isPresent()) {
            User user = existingByGoogleId.orElse(existingByEmail.get());
            
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                userRepository.save(user);
            }
            
            log.info("Usuario existente autenticado con Google: {}", normalizedEmail);
            return GoogleAuthResponse.ok("Login exitoso con Google.", "success", normalizedEmail, new UserResponse(user));
        } else {
            log.info("Creando nuevo usuario desde Google: {}", normalizedEmail);

            User newUser = new User();
            newUser.setGoogleId(googleId);
            newUser.setEmail(normalizedEmail);
            newUser.setPasswordHash(null);
            newUser.setAuthProvider("GOOGLE");
            newUser.setPerfilCompleto(false);
            newUser.setRol("USER");
            newUser.setEstadoCuenta("ACTIVE");
            newUser.setNombre(name != null ? name : "Usuario Google");
            newUser.setFotoPerfil(picture);
            
            OffsetDateTime now = OffsetDateTime.now();
            newUser.setFechaCreacion(now);
            newUser.setFechaActualizacion(now);

            User savedUser = userRepository.save(newUser);

            return GoogleAuthResponse.ok("Registro exitoso con Google.", "success", normalizedEmail, new UserResponse(savedUser));
        }
    }
}