package com.DecklyBuy.Backend.cart;

import com.DecklyBuy.Backend.users.User;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Un carrito pertenece a un solo usuario único
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User usuario;

    // Guarda la lista de ítems. Si borras un ítem de la lista, JPA lo borra de la BD.
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CartItem> items = new ArrayList<>();

    // 1. Constructor vacío obligatorio para JPA
    public Cart() {
    }

    // 2. Constructor con parámetros (Soluciona el error: "The constructor Cart(User) is undefined")
    public Cart(User usuario) {
        this.usuario = usuario;
    }

    // 3. Método de utilidad (Soluciona el error: "The method addItem(CartItem) is undefined")
    public void addItem(CartItem item) {
        items.add(item);
        item.setCart(this);
    }

    public void removeItem(CartItem item) {
        items.remove(item);
        item.setCart(null);
    }

    // --- GETTERS Y SETTERS ---
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public User getUsuario() { 
        return usuario; 
    }
    
    public void setUsuario(User usuario) { 
        this.usuario = usuario; 
    }

    // (Soluciona el error: "The method getItems() is undefined")
    public List<CartItem> getItems() { 
        return items; 
    }
    
    public void setItems(List<CartItem> items) { 
        this.items = items; 
    }
}