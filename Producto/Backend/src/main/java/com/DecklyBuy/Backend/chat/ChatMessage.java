package com.DecklyBuy.Backend.chat;

import com.DecklyBuy.Backend.users.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🛠️ MODIFICADO: Evitamos que el mensaje vuelva a serializar toda la sala en bucle
    @ManyToOne
    @JoinColumn(name = "chat_room_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"comprador", "vendedor", "post"})
    private ChatRoom chatRoom;

    // 🛠️ MODIFICADO: Evitamos que el remitente arrastre colecciones pesadas o perezosas
    @ManyToOne
    @JoinColumn(name = "remitente_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"salas", "posts", "hibernateLazyInitializer", "handler"})
    private User remitente;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenido;

    private LocalDateTime fechaEnvio;

    @PrePersist
    protected void onCreate() {
        this.fechaEnvio = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ChatRoom getChatRoom() { return chatRoom; }
    public void setChatRoom(ChatRoom chatRoom) { this.chatRoom = chatRoom; }

    public User getRemitente() { return remitente; }
    public void setRemitente(User remitente) { this.remitente = remitente; }

    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }

    public LocalDateTime getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(LocalDateTime fechaEnvio) { this.fechaEnvio = fechaEnvio; }
}