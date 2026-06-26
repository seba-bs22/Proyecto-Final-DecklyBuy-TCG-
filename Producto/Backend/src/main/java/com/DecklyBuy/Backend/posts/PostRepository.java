package com.DecklyBuy.Backend.posts;

import com.DecklyBuy.Backend.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUser(User user);

    List<Post> findByUser_Id(UUID userId);

    List<Post> findByCard_Id(String cardId);
}