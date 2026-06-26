package com.DecklyBuy.Backend.config;

import com.DecklyBuy.Backend.auth.GoogleAuthService;
import com.DecklyBuy.Backend.auth.GoogleAuthResponse;
import com.DecklyBuy.Backend.users.UserResponse;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.channel.ChannelProcessingFilter; // 👈 NUEVA IMPORTACIÓN
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter; // 👈 NUEVA IMPORTACIÓN

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Configuration
public class SecurityConfig {

    private final GoogleAuthService googleAuthService;

    public SecurityConfig(GoogleAuthService googleAuthService) {
        this.googleAuthService = googleAuthService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 🚨 SOLUCIÓN MAESTRA: Inyectamos el filtro de CORS al principio absoluto de la cadena de Spring
            .addFilterBefore(new CorsFilter(Objects.requireNonNull(corsConfigurationSource())), ChannelProcessingFilter.class)
            
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Permitir OPTIONS global
                .requestMatchers(
                    "/", "/login**", "/error",
                    "/swagger-ui/**", "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/api/ia/**", "/api/users/**", "/api/auth/**", "/api/chat/**" // 👈 Aseguramos /api/chat/** público
                ).permitAll()
                .requestMatchers(HttpMethod.GET, "/api/posts", "/api/posts/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/posts").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/posts/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/posts/**").authenticated()
                .requestMatchers("/api/upload").authenticated()
                .anyRequest().permitAll()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) -> {
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"error\":\"No hay sesión activa\"}");
                })
            )
            .oauth2Login(oauth -> oauth
                .successHandler((request, response, authentication) -> {
                    try {
                        var oauthUser = (org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal();

                        GoogleAuthResponse authResponse = googleAuthService.processGoogleUser(oauthUser);
                        
                        if (authResponse == null) {
                            response.sendRedirect("https://localhost:5173/login?error=google_service_null");
                            return;
                        }

                        UserResponse userResponse = authResponse.user();

                        if (userResponse == null || userResponse.id() == null) {
                            response.sendRedirect("https://localhost:5173/login?error=google_user_null");
                            return;
                        }

                        request.getSession(true).setAttribute("AUTH_USER_ID", userResponse.id());

                        UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(userResponse.email(), null, new ArrayList<>());
                        SecurityContextHolder.getContext().setAuthentication(auth);

                        response.sendRedirect("https://localhost:5173/login-success");

                    } catch (Exception e) {
                        e.printStackTrace();
                        response.sendRedirect("https://localhost:5173/login?error=server_exception");
                    }
                })
                .failureHandler((request, response, exception) -> {
                    exception.printStackTrace();
                    response.sendRedirect("https://localhost:5173/login?error=google_failure");
                })
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .deleteCookies("JSESSIONID")
                .logoutSuccessUrl("https://localhost:5173/login")
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("https://localhost:5173", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Cabeceras estrictas obligatorias para HTTPS local
        configuration.setAllowedHeaders(List.of("Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With", "Cache-Control"));
        configuration.setExposedHeaders(List.of("Authorization", "Link", "X-Total-Count"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}