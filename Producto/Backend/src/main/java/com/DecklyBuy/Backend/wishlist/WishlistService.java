package com.DecklyBuy.Backend.wishlist;

import com.DecklyBuy.Backend.posts.Post;
import com.DecklyBuy.Backend.posts.PostRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final PostRepository postRepository;

    public WishlistService(WishlistRepository wishlistRepository, PostRepository postRepository) {
        this.wishlistRepository = wishlistRepository;
        this.postRepository = postRepository;
    }

    public void agregarFavorito(UUID userId, Long postId) {
        if (userId == null || postId == null) {
            throw new IllegalArgumentException("El ID de usuario y el ID del post no pueden ser nulos");
        }

        if (wishlistRepository.existsByUserIdAndPostId(userId, postId)) {
            throw new RuntimeException("El post ya está en tu wishlist");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("El post no existe"));

        Wishlist wishlist = new Wishlist();
        wishlist.setUserId(userId);
        wishlist.setPost(post);
        wishlistRepository.save(wishlist);
    }

    public void eliminarFavorito(UUID userId, Long postId) {
        if (userId == null || postId == null) {
            throw new IllegalArgumentException("El ID de usuario y el ID del post no pueden ser nulos");
        }

        Wishlist item = wishlistRepository.findByUserIdAndPostId(userId, postId)
                .orElseThrow(() -> new RuntimeException("No se encontró el registro en la wishlist"));
        
        if (item != null) {
            wishlistRepository.delete(item);
        }
    }

    public List<Wishlist> obtenerWishlistPorUsuario(UUID userId) {
        if (userId == null) {
            throw new IllegalArgumentException("El ID de usuario no puede ser nulo");
        }
        return wishlistRepository.findByUserId(userId);
    }
}