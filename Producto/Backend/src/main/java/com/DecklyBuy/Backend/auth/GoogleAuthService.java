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
import java.util.Random;

@Service
public class GoogleAuthService {

    private static final Logger log = LoggerFactory.getLogger(GoogleAuthService.class);

    private final UserRepository userRepository;
    private final VerificationService verificationService;
    private final EmailService emailService;

    public GoogleAuthService(UserRepository userRepository,
                             VerificationService verificationService,
                             EmailService emailService) {
        this.userRepository = userRepository;
        this.verificationService = verificationService;
        this.emailService = emailService;
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

        // Generar código de verificación y enviarlo
        String code = String.valueOf(new Random().nextInt(900000) + 100000);
        verificationService.saveCode(normalizedEmail, code);
        emailService.sendVerificationCode(normalizedEmail, code);

        if (existingByGoogleId.isPresent() || existingByEmail.isPresent()) {
            // Usuario existente → flujo login
            User user = existingByGoogleId.orElse(existingByEmail.get());
            log.info("Usuario existente, flujo de login con Google para {}", normalizedEmail);

            return GoogleAuthResponse.ok("Código enviado para login con Google.", "login", normalizedEmail, new UserResponse(user));
        } else {
            // Usuario nuevo → flujo registro
            log.info("Usuario nuevo, flujo de registro con Google para {}", normalizedEmail);

            User tempUser = new User();
            tempUser.setGoogleId(googleId);
            tempUser.setEmail(normalizedEmail);
            tempUser.setPasswordHash(null);
            tempUser.setAuthProvider("GOOGLE");
            tempUser.setPerfilCompleto(false);
            tempUser.setRol("USER");
            tempUser.setEstadoCuenta("ACTIVE");
            tempUser.setFechaCreacion(OffsetDateTime.now());
            tempUser.setNombre(name != null ? name : "Usuario Google");
            tempUser.setFotoPerfil(picture);
            tempUser.setFechaActualizacion(OffsetDateTime.now());

            return GoogleAuthResponse.ok("Código enviado para registro con Google.", "register", normalizedEmail, new UserResponse(tempUser));
        }
    }
}
