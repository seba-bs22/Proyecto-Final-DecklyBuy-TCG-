package com.DecklyBuy.Backend.auth;

import com.DecklyBuy.Backend.users.UserResponse;

/**
 * Respuesta estándar para operaciones de autenticación.
 * Incluye un indicador de éxito, un mensaje y el usuario.
 */
public record AuthResponse(boolean success, String message, UserResponse user) {

    public static AuthResponse ok(String message, UserResponse user) {
        return new AuthResponse(true, message, user);
    }

    public static AuthResponse error(String message) {
        return new AuthResponse(false, message, null);
    }
}
