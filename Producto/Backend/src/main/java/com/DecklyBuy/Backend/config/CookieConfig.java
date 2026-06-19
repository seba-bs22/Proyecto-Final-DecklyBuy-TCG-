package com.DecklyBuy.Backend.config;

import org.springframework.boot.web.servlet.server.CookieSameSiteSupplier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de cookies para la aplicación.
 * Fuerza SameSite=None en JSESSIONID para permitir envío en peticiones cross-site.
 */
@Configuration
public class CookieConfig {

    @Bean
    public CookieSameSiteSupplier applicationCookieSameSiteSupplier() {
        // Forzar SameSite=None en JSESSIONID
        return CookieSameSiteSupplier.ofNone();
    }
}
