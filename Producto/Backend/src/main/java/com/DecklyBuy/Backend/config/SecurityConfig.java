package com.DecklyBuy.Backend.config;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

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

@Configuration
public class SecurityConfig {

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

                    String name = oauthUser.getAttribute("name");
                    String email = oauthUser.getAttribute("email");
                    String picture = oauthUser.getAttribute("picture");

                    // Crear objeto
                    Map<String, String> userData = new HashMap<>();
                    userData.put("name", name);
                    userData.put("email", email);
                    userData.put("picture", picture);

                    // Convertir a JSON 
                    ObjectMapper mapper = new ObjectMapper();
                    String json = mapper.writeValueAsString(userData);

                    // Redirigir al frontend con datos
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