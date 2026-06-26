package com.DecklyBuy.Backend.config;

import com.mercadopago.MercadoPagoConfig;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MercadoPagoConfigService {

    @Value("${mercadopago.access.token}")
    private String accessToken;

    @PostConstruct
    public void initMP() {
        // Esto le asigna tu token al SDK oficial de Mercado Pago
        MercadoPagoConfig.setAccessToken(accessToken);
        System.out.println("=================================================");
        System.out.println("=== MERCADO PAGO INICIALIZADO CORRECTAMENTE ===");
        System.out.println("=================================================");
    }
}