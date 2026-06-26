package com.DecklyBuy.Backend.users;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    boolean existsByEmail(String email);
    boolean existsByNombreUsuario(String nombreUsuario);
    Optional<User> findByResetToken(String resetToken);
    Optional<User> findByNombreUsuario(String nombreUsuario);
}
