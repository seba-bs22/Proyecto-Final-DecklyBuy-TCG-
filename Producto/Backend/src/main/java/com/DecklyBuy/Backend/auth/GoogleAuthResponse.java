package com.DecklyBuy.Backend.auth;

import com.DecklyBuy.Backend.users.UserResponse;

/**
 * Respuesta específica para el flujo de Google.
 */
public record GoogleAuthResponse(boolean success, String message, String flow, String email, UserResponse user) {

    public static GoogleAuthResponse ok(String message, String flow, String email, UserResponse user) {
        return new GoogleAuthResponse(true, message, flow, email, user);
    }

    public static GoogleAuthResponse error(String message) {
        return new GoogleAuthResponse(false, message, null, null, null);
    }
}
