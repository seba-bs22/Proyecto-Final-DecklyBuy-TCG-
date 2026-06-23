package com.DecklyBuy.Backend.config;

import com.DecklyBuy.Backend.auth.GoogleAuthService;
import com.DecklyBuy.Backend.auth.GoogleAuthResponse;
import com.DecklyBuy.Backend.users.UserResponse;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final GoogleAuthService googleAuthService;

    public SecurityConfig(GoogleAuthService googleAuthService) {
        this.googleAuthService = googleAuthService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            // Implementación explícita de CORS para HTTPS local
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // 1. Permitir siempre las peticiones de pre-vuelo (CORS OPTIONS)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // 2. Rutas públicas generales
                .requestMatchers(
                    "/", "/login**", "/error",
                    "/swagger-ui/**", "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/api/ia/**", "/api/users/**", "/api/auth/**"
                ).permitAll()
                
                // Permitir acceso público para VER las publicaciones (Tablón y Catálogo)
                .requestMatchers(HttpMethod.GET, "/api/posts", "/api/posts/**").permitAll()
                
                // 3. Rutas de mutación que requieren estrictamente una sesión activa (JSESSIONID)
                .requestMatchers(HttpMethod.POST, "/api/posts").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/posts/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/posts/**").authenticated()
                .requestMatchers("/api/upload").authenticated()
                
                // Cualquier otra ruta no especificada se maneja como pública
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
                    var oauthUser = (org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal();

                    System.out.println("Atributos de Google en successHandler: " + oauthUser.getAttributes());

                    GoogleAuthResponse authResponse = googleAuthService.processGoogleUser(oauthUser);
                    UserResponse userResponse = authResponse.user();

                    if (userResponse == null || userResponse.id() == null) {
                        response.sendRedirect("https://localhost:5173/login?error=google");
                        return;
                    }

                    request.getSession(true).setAttribute("AUTH_USER_ID", userResponse.id());

                    if ("login".equals(authResponse.flow())) {
                        response.sendRedirect("https://localhost:5173/login-verify?email=" + authResponse.email());
                    } else {
                        response.sendRedirect("https://localhost:5173/verify-code?email=" + authResponse.email());
                    }
                })
                .failureHandler((request, response, exception) -> {
                    exception.printStackTrace();
                    System.out.println("Error en login con Google: " + exception.getMessage());
                    response.sendRedirect("https://localhost:5173/login?error=google");
                })
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .deleteCookies("JSESSIONID")
                .logoutSuccessUrl("https://localhost:5173/login")
            );

        return http.build();
    }

    // Configuración centralizada de CORS para heredar a Spring Security
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("https://localhost:5173", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"));
        configuration.setAllowCredentials(true); // Crucial para que viaje el JSESSIONID

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}