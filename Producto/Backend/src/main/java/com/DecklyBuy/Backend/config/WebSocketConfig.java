package com.DecklyBuy.Backend.config; // Ajusta a tu paquete real

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull; // Importación necesaria para evitar la advertencia
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker 
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry config) {
        // Habilita un broker simple en memoria para enviar mensajes a los clientes
        config.enableSimpleBroker("/queue");
        
        // El prefijo que usará el Frontend para enviar mensajes hacia el Backend
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        // El punto de entrada al que se conectará React
        registry.addEndpoint("/ws")
                .setAllowedOrigins("https://localhost:5173", "http://localhost:5173") 
                .withSockJS(); 
    }
}