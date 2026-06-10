package com.DecklyBuy.Backend.config;

import org.springframework.boot.web.servlet.server.CookieSameSiteSupplier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CookieConfig {
    @Bean
    public CookieSameSiteSupplier applicationCookieSameSiteSupplier() {
        // Forzar SameSite=None en JSESSIONID
        return CookieSameSiteSupplier.ofNone();
    }
}
