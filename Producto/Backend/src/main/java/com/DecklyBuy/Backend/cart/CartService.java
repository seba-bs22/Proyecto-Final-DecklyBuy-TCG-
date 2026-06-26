package com.DecklyBuy.Backend.cart;

import com.DecklyBuy.Backend.posts.Post;
import com.DecklyBuy.Backend.posts.PostRepository;
import com.DecklyBuy.Backend.users.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final PostRepository postRepository;

    public CartService(CartRepository cartRepository, PostRepository postRepository) {
        this.cartRepository = cartRepository;
        this.postRepository = postRepository;
    }

    @Transactional
    public Cart obtenerOCrearCarrito(User usuario) {
        Cart cart = cartRepository.findByUsuario(usuario)
                .orElseGet(() -> {
                    Cart nuevoCarrito = new Cart(usuario);
                    return cartRepository.save(nuevoCarrito);
                });
        if (cart.getItems() != null) {
            cart.getItems().size();
        }
        return cart;
    }

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

    @Transactional
    public Cart obtenerCarrito(User usuario) {
        return obtenerOCrearCarrito(usuario);
    }

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