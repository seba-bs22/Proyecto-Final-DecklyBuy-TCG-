package com.DecklyBuy.Backend.posts;

import com.DecklyBuy.Backend.users.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, Long> {

    // Buscar todos los posts de un usuario específico
    List<Post> findByUser(User user);

    // Alternativa: buscar por userId directamente
    List<Post> findByUser_Id(UUID userId);
}
