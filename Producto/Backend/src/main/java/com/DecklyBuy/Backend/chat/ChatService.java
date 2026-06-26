package com.DecklyBuy.Backend.chat;

import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull; // Importación clave para la seguridad de tipos

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChatService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    // Agregado @NonNull a los parámetros para solucionar la advertencia
    public ChatRoom obtenerOCrearSala(@NonNull UUID compradorId, @NonNull UUID vendedorId) {
        User comprador = userRepository.findById(compradorId)
                .orElseThrow(() -> new RuntimeException("Comprador no encontrado"));
        User vendedor = userRepository.findById(vendedorId)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        Optional<ChatRoom> salaExistente = chatRoomRepository.findByCompradorAndVendedor(comprador, vendedor);
        
        if (salaExistente.isPresent()) {
            return salaExistente.get();
        }

        ChatRoom nuevaSala = new ChatRoom();
        nuevaSala.setComprador(comprador);
        nuevaSala.setVendedor(vendedor);
        
        return chatRoomRepository.save(nuevaSala);
    }

    // Agregado @NonNull aquí también por seguridad
    public ChatMessage guardarMensaje(@NonNull Long salaId, @NonNull UUID remitenteId, String contenido) {
        ChatRoom sala = chatRoomRepository.findById(salaId)
                .orElseThrow(() -> new RuntimeException("Sala de chat no encontrada"));
        User remitente = userRepository.findById(remitenteId)
                .orElseThrow(() -> new RuntimeException("Remitente no encontrado"));

        ChatMessage mensaje = new ChatMessage();
        mensaje.setChatRoom(sala);
        mensaje.setRemitente(remitente);
        mensaje.setContenido(contenido);

        return chatMessageRepository.save(mensaje);
    }

    // Agregado @NonNull al ID del usuario
    public List<ChatRoom> listarSalasDeUsuario(@NonNull UUID usuarioId) {
        User usuario = userRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return chatRoomRepository.findByCompradorOrVendedor(usuario, usuario);
    }

    public List<ChatMessage> obtenerHistorial(@NonNull Long salaId) {
        return chatMessageRepository.findByChatRoomIdOrderByFechaEnvioAsc(salaId);
    }
}