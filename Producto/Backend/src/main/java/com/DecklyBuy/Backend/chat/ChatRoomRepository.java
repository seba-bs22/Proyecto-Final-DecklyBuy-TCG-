package com.DecklyBuy.Backend.chat;

import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.posts.Post; 

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    // Método para verificar si ya existe una sala exacta para ese post
    Optional<ChatRoom> findByCompradorAndVendedorAndPost(User comprador, User vendedor, Post post);
    
    // Opción A: Buscar por el objeto User completo (la que ya tenías)
    @Query("SELECT c FROM ChatRoom c WHERE c.comprador = :usuario OR c.vendedor = :usuario ORDER BY c.fechaCreacion DESC")
    List<ChatRoom> listarSalasPorUsuario(@Param("usuario") User usuario);

    // 🛠️ Opción B: Buscar directamente por el UUID plano (Para evitar hacer el findById en el servicio)
    @Query("SELECT c FROM ChatRoom c WHERE c.comprador.id = :usuarioId OR c.vendedor.id = :usuarioId ORDER BY c.fechaCreacion DESC")
    List<ChatRoom> listarSalasPorUsuarioIdPlano(@Param("usuarioId") UUID usuarioId);
}