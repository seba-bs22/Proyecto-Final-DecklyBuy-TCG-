package com.DecklyBuy.Backend.users;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

/**
 * Repositorio JPA para la entidad User.
 * Incluye métodos de búsqueda y validación de existencia.
 */
public interface UserRepository extends JpaRepository<User, UUID> {

    // Buscar usuario por email
    Optional<User> findByEmail(String email);

    // Buscar usuario por Google ID (login social)
    Optional<User> findByGoogleId(String googleId);

    // Validar existencia por email
    boolean existsByEmail(String email);

    // Validar existencia por nombre de usuario
    boolean existsByNombreUsuario(String nombreUsuario);

    // Buscar usuario por token de reseteo de contraseña
    Optional<User> findByResetToken(String resetToken);

    // Buscar usuario por nombre de usuario
    Optional<User> findByNombreUsuario(String nombreUsuario);
}
