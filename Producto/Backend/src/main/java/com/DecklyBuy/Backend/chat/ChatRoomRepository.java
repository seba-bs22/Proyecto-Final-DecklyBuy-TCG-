package com.DecklyBuy.Backend.chat;

import com.DecklyBuy.Backend.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    // Busca si ya existe un chat específico entre un comprador y un vendedor
    Optional<ChatRoom> findByCompradorAndVendedor(User comprador, User vendedor);
    
    // Devuelve todos los chats donde el usuario participe (ya sea como comprador o como vendedor)
    List<ChatRoom> findByCompradorOrVendedor(User comprador, User vendedor);
}