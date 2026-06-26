package com.DecklyBuy.Backend.chat;

import com.DecklyBuy.Backend.users.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_rooms")
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "comprador_id", nullable = false)
    private User comprador;

    @ManyToOne
    @JoinColumn(name = "vendedor_id", nullable = false)
    private User vendedor;

    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }

    // --- GETTERS Y SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getComprador() { return comprador; }
    public void setComprador(User comprador) { this.comprador = comprador; }

    public User getVendedor() { return vendedor; }
    public void setVendedor(User vendedor) { this.vendedor = vendedor; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}