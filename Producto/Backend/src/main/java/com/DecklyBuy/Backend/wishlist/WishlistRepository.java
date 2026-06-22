package com.DecklyBuy.Backend.wishlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(UUID userId);
    Optional<Wishlist> findByUserIdAndPostId(UUID userId, Long postId);
    boolean existsByUserIdAndPostId(UUID userId, Long postId);
}