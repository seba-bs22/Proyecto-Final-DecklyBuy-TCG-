package com.DecklyBuy.Backend.auth;

import com.DecklyBuy.Backend.users.UserResponse;

public record AuthResponse(boolean success, String message, UserResponse user) {

    public static AuthResponse ok(String message, UserResponse user) {
        return new AuthResponse(true, message, user);
    }

    public static AuthResponse error(String message) {
        return new AuthResponse(false, message, null);
    }
}