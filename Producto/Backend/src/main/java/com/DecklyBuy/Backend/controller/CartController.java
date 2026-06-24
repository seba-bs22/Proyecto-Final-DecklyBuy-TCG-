package com.DecklyBuy.Backend.controller;

import com.DecklyBuy.Backend.cart.Cart;
import com.DecklyBuy.Backend.cart.CartItem;
import com.DecklyBuy.Backend.cart.CartService;
import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.users.UserRepository; // 👈 Importamos tu repositorio de usuarios
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID; // 👈 Importamos UUID

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "https://localhost:5173", allowCredentials = "true") // 👈 Ajustado a https:// como tu frontend
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository; // 👈 Inyectamos el repositorio para resolver el usuario por ID

    @GetMapping
    public ResponseEntity<?> verCarrito(HttpSession session) {
        try {
            // 1. Buscamos el UUID guardado bajo la etiqueta real de tu AuthController
            Object attr = session.getAttribute("AUTH_USER_ID");
            if (attr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "No autorizado. Debes iniciar sesión."));
            }

            // 2. Casteamos de forma segura al tipo UUID
            UUID userId = (UUID) attr;

            // 3. Obtenemos el usuario de la base de datos
            User usuarioLogueado = userRepository.findById(userId).orElse(null);
            if (usuarioLogueado == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Usuario de la sesión no encontrado."));
            }

            // 4. Procesamos el carrito normalmente con el usuario recuperado
            Cart cart = cartService.obtenerCarrito(usuarioLogueado);
            
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("id", cart.getId());
            
            List<Map<String, Object>> listaItems = new ArrayList<>();
            if (cart.getItems() != null) {
                for (CartItem item : cart.getItems()) {
                    Map<String, Object> itemMap = new HashMap<>();
                    itemMap.put("id", item.getId());
                    itemMap.put("cantidad", item.getCantidad());
                    
                    if (item.getPost() != null) {
                        Map<String, Object> postMap = new HashMap<>();
                        postMap.put("id", item.getPost().getId());
                        postMap.put("precio", item.getPost().getPrecio());
                        postMap.put("imagenUrl", item.getPost().getImagenUrl());
                        postMap.put("estado", item.getPost().getEstadoDetectado()); 

                        if (item.getPost().getCard() != null) {
                            postMap.put("titulo", item.getPost().getCard().getName()); 
                        } else {
                            postMap.put("titulo", "Carta TCG sin nombre");
                        }
                        
                        itemMap.put("post", postMap);
                    }
                    listaItems.add(itemMap);
                }
            }
            
            respuesta.put("items", listaItems);
            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            System.err.println("=== ERROR EN VER_CARRITO ===");
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al procesar los datos del carrito: " + e.getMessage()));
        }
    }

    @PostMapping("/add/{postId}")
    public ResponseEntity<?> agregarAlCarrito(@PathVariable Long postId, HttpSession session) {
        Map<String, String> respuesta = new HashMap<>();
        
        Object attr = session.getAttribute("AUTH_USER_ID");
        if (attr == null) {
            respuesta.put("error", "No autorizado. Debes iniciar sesión.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(respuesta);
        }

        try {
            UUID userId = (UUID) attr;
            User usuarioLogueado = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
            
            cartService.agregarPostAlCarrito(usuarioLogueado, postId);
            respuesta.put("mensaje", "¡Carta añadida al carrito con éxito! 🛒");
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        } catch (IllegalStateException e) {
            respuesta.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        } catch (Exception e) {
            respuesta.put("error", "Error interno al procesar la solicitud: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> eliminarDelCarrito(@PathVariable Long cartItemId, HttpSession session) {
        Object attr = session.getAttribute("AUTH_USER_ID");
        if (attr == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Debes iniciar sesión."));
        }

        try {
            UUID userId = (UUID) attr;
            User usuarioLogueado = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
            
            cartService.eliminarItemDelCarrito(usuarioLogueado, cartItemId);
            return ResponseEntity.ok(Map.of("mensaje", "Producto eliminado del carrito."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}