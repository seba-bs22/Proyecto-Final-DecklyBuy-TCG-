package com.DecklyBuy.Backend.chat;

import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.users.UserRepository;
import com.DecklyBuy.Backend.posts.Post;
import com.DecklyBuy.Backend.posts.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

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

    @Autowired
    private PostRepository postRepository;

    public ChatRoom obtenerSalaPorId(@NonNull Long salaId) {
        return chatRoomRepository.findById(salaId)
                .orElseThrow(() -> new RuntimeException("Sala de chat no encontrada con ID: " + salaId));
    }

    public ChatRoom obtenerOCrearSala(@NonNull UUID compradorId, @NonNull UUID vendedorId, @NonNull Long postId) {
        User comprador = userRepository.findById(compradorId)
                .orElseThrow(() -> new RuntimeException("Comprador no encontrado"));
        User vendedor = userRepository.findById(vendedorId)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Publicación/Carta no encontrada"));

        Optional<ChatRoom> salaExistente = chatRoomRepository.findByCompradorAndVendedorAndPost(comprador, vendedor, post);
        
        if (salaExistente.isPresent()) {
            return salaExistente.get();
        }

        ChatRoom nuevaSala = new ChatRoom();
        nuevaSala.setComprador(comprador);
        nuevaSala.setVendedor(vendedor);
        nuevaSala.setPost(post);
        
        return chatRoomRepository.save(nuevaSala);
    }

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

    // 🛠️ CORRECCIÓN EN EL FLUJO: Enviamos el UUID original sin transformar a String 
    // a la nueva query optimizada del repositorio para que Hibernate mapee las columnas id directamente.
    public List<ChatRoom> listarSalasDeUsuario(@NonNull UUID usuarioId) {
        return chatRoomRepository.listarSalasPorUsuarioIdPlano(usuarioId);
    }

    public List<ChatMessage> obtenerHistorial(@NonNull Long salaId) {
        return chatMessageRepository.findByChatRoomIdOrderByFechaEnvioAsc(salaId);
    }
}