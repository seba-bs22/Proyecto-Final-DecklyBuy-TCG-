package com.DecklyBuy.Backend.controller;

import com.DecklyBuy.Backend.chat.ChatRoom;
import com.DecklyBuy.Backend.chat.ChatMessage;
import com.DecklyBuy.Backend.chat.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") 
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/sala")
    public ResponseEntity<ChatRoom> crearSala(@RequestBody SalaRequest request) {
        UUID comprador = Objects.requireNonNull(UUID.fromString(request.getCompradorId()));
        UUID vendedor = Objects.requireNonNull(UUID.fromString(request.getVendedorId()));
        Long postId = Objects.requireNonNull(request.getPostId(), "El postId es obligatorio");
        ChatRoom sala = chatService.obtenerOCrearSala(comprador, vendedor, postId);
        return ResponseEntity.ok(sala);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ChatRoom>> obtenerSalasPorUsuario(@PathVariable("usuarioId") UUID usuarioId) {
        // 🛠️ MODIFICADO: Dejamos que Spring convierta directamente a UUID para evitar problemas de codificación de texto
        UUID uuid = Objects.requireNonNull(usuarioId, "El ID de usuario no puede ser nulo");
        
        System.out.println("====== PROBANDO ENDPOINT VIA URL ======");
        System.out.println("Buscando chats para el usuario: " + uuid);
        
        List<ChatRoom> salas = chatService.listarSalasDeUsuario(uuid);
        
        System.out.println("Salas encontradas con éxito: " + salas.size());
        System.out.println("=======================================");
        
        return ResponseEntity.ok(salas);
    }

    @GetMapping("/sala/{salaId}/historial")
    public ResponseEntity<List<ChatMessage>> obtenerHistorial(@PathVariable("salaId") Long salaId) {
        Long idSala = Objects.requireNonNull(salaId);
        List<ChatMessage> historial = chatService.obtenerHistorial(idSala);
        return ResponseEntity.ok(historial);
    }
}

class SalaRequest {
    private String compradorId;
    private String vendedorId;
    private Long postId;

    public String getCompradorId() { return compradorId; }
    public void setCompradorId(String compradorId) { this.compradorId = compradorId; }
    public String getVendedorId() { return vendedorId; }
    public void setVendedorId(String vendedorId) { this.vendedorId = vendedorId; }
    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }
}