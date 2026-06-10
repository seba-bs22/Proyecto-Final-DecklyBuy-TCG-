package com.DecklyBuy.Backend.config;

import com.DecklyBuy.Backend.auth.GoogleAuthService;
import com.DecklyBuy.Backend.users.UserResponse;
import com.DecklyBuy.Backend.users.UserDetailsServiceImpl;

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
    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(GoogleAuthService googleAuthService,
                          UserDetailsServiceImpl userDetailsService) {
        this.googleAuthService = googleAuthService;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
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
            // Login por formulario para usuarios de BD
            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            )
            // Login con Google
            .oauth2Login(oauth -> oauth
                .successHandler((request, response, authentication) -> {
                    var oauthUser = (org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal();

                    // Procesar usuario de Google y guardarlo en BD si es necesario
                    UserResponse userResponse = googleAuthService.processGoogleUser(oauthUser);

                    // Guardar en sesión el ID del usuario
                    request.getSession(true).setAttribute("AUTH_USER_ID", userResponse.getId());

                    // Redirigir directamente al frontend
                    response.sendRedirect("http://localhost:5173/home");
                })
            )
            // Remember-me conectado a UserDetailsServiceImpl
            .rememberMe(remember -> remember
                .alwaysRemember(true)
                .tokenValiditySeconds(604800) // 7 días
                .key("claveSecretaSuperSegura")
                .userDetailsService(userDetailsService)
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .deleteCookies("JSESSIONID", "remember-me")
                .logoutSuccessUrl("/")
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
