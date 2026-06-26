package com.DecklyBuy.Backend.auth;

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
