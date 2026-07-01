package com.DecklyBuy.Backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    // 1. ENDPOINT: Crear o recuperar sala
    @PostMapping("/sala")
    public ResponseEntity<?> crearSala(@RequestBody SalaRequest request) {
        return ResponseEntity.ok(new SalaResponse(1L, request.getCompradorId(), request.getVendedorId()));
    }

    // 2. ENDPOINT: Traer salas por ID de usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<?>> obtenerSalasPorUsuario(@PathVariable String usuarioId) {
        List<Object> salasMock = new ArrayList<>();
        
        UserMock comprador = new UserMock(usuarioId, "Tu Usuario", "Comprador");
        UserMock vendedor = new UserMock("f208a9a5-ad47-4765-b741-d245c0c839bd", "Vendedor Deckly", "Vendedor");
        
        salasMock.add(new SalaCompletaResponse(1L, comprador, vendedor));
        
        return ResponseEntity.ok(salasMock);
    }

    // 3. 🚀 ENDPOINT OPTIMIZADO: Historial de mensajes de la sala
    @GetMapping("/sala/{salaId}/historial")
    public ResponseEntity<List<?>> obtenerHistorial(@PathVariable Long salaId) {
        List<MensajeMock> historial = new ArrayList<>();
        
        // 🚨 CAMBIO AQUÍ: Eliminamos el mensaje molesto "¡Hola! Sí, la carta..." 
        // Dejamos la lista vacía temporalmente para que, cuando no haya mensajes en la BD,
        // el chat se muestre limpio y vacío en el Front-end.
        
        return ResponseEntity.ok(historial);
    }
}

// --- DTOs temporales de soporte ---
class SalaRequest {
    private String compradorId; private String vendedorId;
    public String getCompradorId() { return compradorId; } public String getVendedorId() { return vendedorId; }
}
class SalaResponse {
    private Long id; private String compradorId; private String vendedorId;
    public SalaResponse(Long id, String c, String v) { this.id = id; this.compradorId = c; this.vendedorId = v; }
    public Long getId() { return id; } public String getCompradorId() { return compradorId; } public String getVendedorId() { return vendedorId; }
}
class UserMock {
    private String id; private String nombreUsuario; private String rol;
    public UserMock(String id, String n, String r) { this.id = id; this.nombreUsuario = n; this.rol = r; }
    public String getId() { return id; } public String getNombreUsuario() { return nombreUsuario; } public String getRol() { return rol; }
}
class SalaCompletaResponse {
    private Long id; private UserMock comprador; private UserMock vendedor;
    public SalaCompletaResponse(Long id, UserMock c, UserMock v) { this.id = id; this.comprador = c; this.vendedor = v; }
    public Long getId() { return id; } public UserMock getComprador() { return comprador; } public UserMock getVendedor() { return vendedor; }
}
class MensajeMock {
    private Long salaId; private String remitenteId; private String contenido; private String fechaEnvio;
    public MensajeMock(Long s, String r, String c, String f) { this.salaId = s; this.remitenteId = r; this.contenido = c; this.fechaEnvio = f; }
    public Long getSalaId() { return salaId; } public String getRemitenteId() { return remitenteId; } public String getContenido() { return contenido; } public String getFechaEnvio() { return fechaEnvio; }
}