package com.DecklyBuy.Backend.config;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import com.DecklyBuy.Backend.auth.GoogleAuthService;
import com.DecklyBuy.Backend.users.UserResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class SecurityConfig {

    private final GoogleAuthService googleAuthService;

    public SecurityConfig(GoogleAuthService googleAuthService) {
        this.googleAuthService = googleAuthService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // Desactivar CSRF (solo desarrollo)
            .csrf(csrf -> csrf.disable())

            // Rutas públicas y protegidas
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",
                    "/login**",
                    "/error",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/api/ia/**",
                    "/api/users/**",
                    "/api/auth/**"
                ).permitAll()
                .anyRequest().authenticated()
            )

            // Login con Google
            .oauth2Login(oauth -> oauth
                .successHandler((request, response, authentication) -> {

                    var oauthUser = (org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal();

                    //Crear o actualizar usuario Google
                    UserResponse userResponse = googleAuthService.processGoogleUser(oauthUser);

                    //Guardar sesion
                    request.getSession(true).setAttribute("AUTH_USER_ID", userResponse.getId());

                    // Convertir usuario a JSON
                    ObjectMapper mapper = new ObjectMapper();
                    mapper.registerModule(new JavaTimeModule());

                    String json = mapper.writeValueAsString(userResponse);

                    // Redirigir al frontend 
                    String redirectUrl = "http://localhost:5173/login-success?user=" +
                            URLEncoder.encode(json, StandardCharsets.UTF_8);

                    response.sendRedirect(redirectUrl);
                })
            )

            // CORS 
            .cors(Customizer.withDefaults());

        return http.build();
    }

    // Configuración CORS
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}