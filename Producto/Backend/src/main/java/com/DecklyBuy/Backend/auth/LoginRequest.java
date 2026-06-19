package com.DecklyBuy.Backend.auth;

/**
 * DTO para solicitudes de login.
 * Contiene el correo y la contraseña enviados desde el frontend.
 */
public record LoginRequest(String email, String password) {}
