package com.DecklyBuy.Backend.cart;

import com.DecklyBuy.Backend.posts.Post;
import com.fasterxml.jackson.annotation.JsonIgnore; // <-- AÑADIDO
import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Muchos ítems pertenecen a un solo carrito
    @JsonIgnore // <-- AÑADIDO: Evita la recursión infinita en las respuestas JSON
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    // Cada ítem apunta a una publicación específica (la carta)
    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(nullable = false)
    private Integer cantidad = 1;

    // Constructor vacío obligatorio para JPA
    public CartItem() {
    }

    public CartItem(Cart cart, Post post, Integer cantidad) {
        this.cart = cart;
        this.post = post;
        this.cantidad = cantidad;
    }

    // --- GETTERS Y SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Cart getCart() { return cart; }
    public void setCart(Cart cart) { this.cart = cart; }

    public Post getPost() { return post; }
    public void setPost(Post post) { this.post = post; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}