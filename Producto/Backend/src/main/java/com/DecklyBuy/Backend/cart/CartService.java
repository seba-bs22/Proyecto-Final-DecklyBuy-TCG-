package com.DecklyBuy.Backend.cart;

import com.DecklyBuy.Backend.posts.Post;
import com.DecklyBuy.Backend.posts.PostRepository;
import com.DecklyBuy.Backend.users.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PostRepository postRepository;

    /**
     * Obtiene el carrito del usuario. Si no existe, crea uno nuevo.
     */
    @Transactional
    public Cart obtenerOCrearCarrito(User usuario) {
        Cart cart = cartRepository.findByUsuario(usuario)
                .orElseGet(() -> {
                    Cart nuevoCarrito = new Cart(usuario);
                    return cartRepository.save(nuevoCarrito);
                });
        // Forzamos la inicialización de la lista perezosa mientras la transacción está abierta
        if (cart.getItems() != null) {
            cart.getItems().size();
        }
        return cart;
    }

    /**
     * Añade una carta (Post) al carrito del usuario.
     */
    @Transactional
    public void agregarPostAlCarrito(User usuario, Long postId) {
        if (postId == null) {
            throw new IllegalArgumentException("El ID de la publicación no puede ser nulo.");
        }

        Cart cart = obtenerOCrearCarrito(usuario);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("La publicación con ID " + postId + " no existe."));

        boolean yaEstaEnCarrito = cart.getItems().stream()
                .anyMatch(item -> item.getPost() != null && item.getPost().getId().equals(postId));

        if (yaEstaEnCarrito) {
            throw new IllegalStateException("Esta carta ya se encuentra en tu carrito de compras.");
        }

        CartItem nuevoItem = new CartItem(cart, post, 1);
        cart.addItem(nuevoItem);

        cartRepository.save(cart);
    }

    /**
     * Obtiene el carrito completo usando una transacción de escritura/lectura normal
     */
    @Transactional
    public Cart obtenerCarrito(User usuario) {
        return obtenerOCrearCarrito(usuario);
    }

    /**
     * Elimina una carta específica del carrito utilizando el ID del CartItem.
     */
    @Transactional
    public void eliminarItemDelCarrito(User usuario, Long cartItemId) {
        if (cartItemId == null) {
            throw new IllegalArgumentException("El ID del ítem no puede ser nulo.");
        }

        Cart cart = obtenerOCrearCarrito(usuario);
        
        CartItem itemAEliminar = cart.getItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("El producto no se encuentra en tu carrito."));

        cart.removeItem(itemAEliminar);
        cartRepository.save(cart);
    }
}