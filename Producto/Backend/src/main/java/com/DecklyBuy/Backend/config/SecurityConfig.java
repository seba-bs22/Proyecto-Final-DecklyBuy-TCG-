package com.DecklyBuy.Backend.config;

import com.DecklyBuy.Backend.auth.GoogleAuthService;
import com.DecklyBuy.Backend.auth.GoogleAuthResponse;
import com.DecklyBuy.Backend.users.UserResponse;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    private final GoogleAuthService googleAuthService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    public SecurityConfig(GoogleAuthService googleAuthService) {
        this.googleAuthService = googleAuthService;
    }

    private String front(String path) {
        return frontendUrl.replaceAll("/$", "") + path;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(
                    "/",
                    "/login**",
                    "/error",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/api/ia/**",
                    "/api/users/**",
                    "/api/auth/**",
                    "/api/chat/**",
                    "/api/mercadopago/**"
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
                            response.sendRedirect(front("/login?error=google_service_null"));
                            return;
                        }

                        UserResponse userResponse = authResponse.user();

                        if (userResponse == null || userResponse.id() == null) {
                            response.sendRedirect(front("/login?error=google_user_null"));
                            return;
                        }

                        request.getSession(true).setAttribute("AUTH_USER_ID", userResponse.id());

                        UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(userResponse.email(), null, new ArrayList<>());

                        SecurityContextHolder.getContext().setAuthentication(auth);

                        response.sendRedirect(front("/login-success"));

                    } catch (Exception e) {
                        e.printStackTrace();
                        response.sendRedirect(front("/login?error=server_exception"));
                    }
                })
                .failureHandler((request, response, exception) -> {
                    exception.printStackTrace();
                    response.sendRedirect(front("/login?error=google_failure"));
                })
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .deleteCookies("JSESSIONID")
                .logoutSuccessUrl(front("/login"))
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList();

        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of(
                "Origin",
                "Content-Type",
                "Accept",
                "Authorization",
                "X-Requested-With",
                "Cache-Control"
        ));
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