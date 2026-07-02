package com.DecklyBuy.Backend.controller;

import com.DecklyBuy.Backend.chat.ChatRoom;
import com.DecklyBuy.Backend.chat.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.util.Objects;
import java.util.UUID;

@Controller
public class MessageController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.enviarMensaje/{salaId}")
    @SendTo("/topic/sala/{salaId}")
    public MensajeWebsocketPayload retransmitirMensaje(
            @DestinationVariable Long salaId, 
            @Payload MensajeWebsocketPayload mensaje) {
        
        Long idSala = Objects.requireNonNull(salaId);
        UUID idRemitente = Objects.requireNonNull(UUID.fromString(mensaje.getRemitenteId()));
        
        // 1. Guarda el mensaje en la base de datos como ya lo hacía
        chatService.guardarMensaje(idSala, idRemitente, mensaje.getContenido());
        
        // 2. Notificación en tiempo real para el receptor
        try {
            ChatRoom sala = chatService.obtenerSalaPorId(idSala); 
            if (sala != null) {
                // Sacamos los IDs de los objetos User que están en la sala
                UUID idComprador = sala.getComprador().getId();
                UUID idVendedor = sala.getVendedor().getId();
                
                // Si el que envió el mensaje es el comprador, el receptor es el vendedor (y viceversa)
                UUID idReceptor = idComprador.equals(idRemitente) ? idVendedor : idComprador;
                
                // Enviamos la alerta "NUEVO_MENSAJE" a la ruta exclusiva del receptor
                messagingTemplate.convertAndSend("/topic/notificaciones/" + idReceptor.toString(), "NUEVO_MENSAJE");
            }
        } catch (Exception e) {
            System.err.println("Error al enviar la notificación global: " + e.getMessage());
        }
        
        return mensaje;
    }
}

class MensajeWebsocketPayload {
    private Long salaId;
    private String remitenteId;
    private String contenido;
    private String fechaEnvio;

    public Long getSalaId() { return salaId; } 
    public void setSalaId(Long s) { this.salaId = s; }
    public String getRemitenteId() { return remitenteId; } 
    public void setRemitenteId(String r) { this.remitenteId = r; }
    public String getContenido() { return contenido; } 
    public void setContenido(String c) { this.contenido = c; }
    public String getFechaEnvio() { return fechaEnvio; } 
    public void setFechaEnvio(String f) { this.fechaEnvio = f; }
}