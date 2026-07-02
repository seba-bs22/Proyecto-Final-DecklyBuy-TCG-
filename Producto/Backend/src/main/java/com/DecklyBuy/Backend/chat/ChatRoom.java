package com.DecklyBuy.Backend.chat;

import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.posts.Post; 

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_rooms")
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🛠️ MODIFICADO: Protegemos al comprador de bucles y proxies Lazy vacíos de Hibernate
    @ManyToOne
    @JoinColumn(name = "comprador_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"salas", "posts", "hibernateLazyInitializer", "handler"})
    private User comprador;

    // 🛠️ MODIFICADO: Protegemos al vendedor de bucles y proxies Lazy vacíos de Hibernate
    @ManyToOne
    @JoinColumn(name = "vendedor_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"salas", "posts", "hibernateLazyInitializer", "handler"})
    private User vendedor;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"user", "hibernateLazyInitializer", "handler"})
    private Post post;

    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getComprador() { return comprador; }
    public void setComprador(User comprador) { this.comprador = comprador; }

    public User getVendedor() { return vendedor; }
    public void setVendedor(User vendedor) { this.vendedor = vendedor; }

    public Post getPost() { return post; }
    public void setPost(Post post) { this.post = post; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}