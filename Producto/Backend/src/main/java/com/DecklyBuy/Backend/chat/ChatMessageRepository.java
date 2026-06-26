package com.DecklyBuy.Backend.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    // Trae el historial completo de mensajes de una sala ordenados por fecha de envío
    List<ChatMessage> findByChatRoomIdOrderByFechaEnvioAsc(Long chatRoomId);
}