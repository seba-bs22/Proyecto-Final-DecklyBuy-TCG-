package com.DecklyBuy.Backend.auth;

/**
 * DTO para solicitudes de registro de usuario.
 * Incluye datos personales, credenciales y código de verificación.
 */
public record RegisterRequest(
    String nombre,
    String apellido,
    String nombreUsuario,
    String numeroContacto,
    String email,
    String password,
    String confirmPassword,
    String code
) {}
