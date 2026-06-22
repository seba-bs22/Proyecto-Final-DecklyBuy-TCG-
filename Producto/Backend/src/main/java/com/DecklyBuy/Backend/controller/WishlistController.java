package com.DecklyBuy.Backend.controller;

import com.DecklyBuy.Backend.wishlist.Wishlist;
import com.DecklyBuy.Backend.wishlist.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "https://localhost:5173", allowCredentials = "true")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // 1. AGREGAR A WISHLIST
    @PostMapping("/add/{postId}")
    public ResponseEntity<?> addToWishlist(@PathVariable Long postId, HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "No hay sesión activa"));
        }

        UUID userId = (UUID) session.getAttribute("AUTH_USER_ID");
        try {
            wishlistService.agregarFavorito(userId, postId);
            return ResponseEntity.ok(Map.of("message", "Agregado a la wishlist correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 2. ELIMINAR DE WISHLIST
    @DeleteMapping("/remove/{postId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long postId, HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "No hay sesión activa"));
        }

        UUID userId = (UUID) session.getAttribute("AUTH_USER_ID");
        try {
            wishlistService.eliminarFavorito(userId, postId);
            return ResponseEntity.ok(Map.of("message", "Eliminado de la wishlist correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // 3. OBTENER WISHLIST DE LA SESIÓN ACTUAL
    @GetMapping
    public ResponseEntity<?> getUserWishlist(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "No hay sesión activa"));
        }

        UUID userId = (UUID) session.getAttribute("AUTH_USER_ID");
        List<Wishlist> userWishlist = wishlistService.obtenerWishlistPorUsuario(userId);
        return ResponseEntity.ok(userWishlist);
    }
}