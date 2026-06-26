package com.DecklyBuy.Backend.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    // Al enviar a /app/chat.enviarMensaje/1 desde React, cae aquí:
    @MessageMapping("/chat.enviarMensaje/{salaId}")
    @SendTo("/topic/sala/{salaId}")
    public MensajeWebsocketPayload retransmitirMensaje(
            @DestinationVariable Long salaId, 
            @Payload MensajeWebsocketPayload mensaje) {
        
        System.out.println("📬 Mensaje recibido de la sala " + salaId + ": " + mensaje.getContenido());
        
        // (Opcional) Aquí puedes llamar a tu servicio para guardar el mensaje de forma asíncrona en tu Base de Datos:
        // mensajeService.guardar(mensaje);
        
        return mensaje; // Lo que se retorna se envía automáticamente a todos los suscritos en el @SendTo
    }
}

class MensajeWebsocketPayload {
    private Long salaId;
    private String remitenteId;
    private String contenido;
    private String fechaEnvio;

    // Getters y Setters necesarios para Jackson
    public Long getSalaId() { return salaId; } public void setSalaId(Long s) { this.salaId = s; }
    public String getRemitenteId() { return remitenteId; } public void setRemitenteId(String r) { this.remitenteId = r; }
    public String getContenido() { return contenido; } public void setContenido(String c) { this.contenido = c; }
    public String getFechaEnvio() { return fechaEnvio; } public void setFechaEnvio(String f) { this.fechaEnvio = f; }
}