package com.DecklyBuy.Backend.users;

/**
 * Respuesta estándar para endpoints relacionados con usuarios.
 * Incluye un mensaje y, opcionalmente, un objeto UserResponse.
 */
public record ApiResponse(
        String message,
        UserResponse user
) {}
