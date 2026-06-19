package com.DecklyBuy.Backend.config;

import com.DecklyBuy.Backend.auth.GoogleAuthService;
import com.DecklyBuy.Backend.auth.GoogleAuthResponse;
import com.DecklyBuy.Backend.users.UserResponse;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

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
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/", "/login**", "/error",
                    "/swagger-ui/**", "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/api/ia/**", "/api/users/**", "/api/auth/**"
                ).permitAll()
                .requestMatchers("/api/upload", "/api/posts/**").authenticated()
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

                    // Log de atributos crudos que entrega Google
                    System.out.println("Atributos de Google en successHandler: " + oauthUser.getAttributes());

                    GoogleAuthResponse authResponse = googleAuthService.processGoogleUser(oauthUser);
                    UserResponse userResponse = authResponse.user();

                    if (userResponse == null || userResponse.id() == null) {
                        response.sendRedirect("https://localhost:5173/login?error=google");
                        return;
                    }

                    // Guardar el ID del usuario en la sesión
                    request.getSession(true).setAttribute("AUTH_USER_ID", userResponse.id());

                    // 🔑 Redirigir según el flujo
                    if ("login".equals(authResponse.flow())) {
                        response.sendRedirect("https://localhost:5173/login-verify?email=" + authResponse.email());
                    } else {
                        response.sendRedirect("https://localhost:5173/verify-code?email=" + authResponse.email());
                    }
                })
                .failureHandler((request, response, exception) -> {
                    exception.printStackTrace(); // imprime el error en consola
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

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
