package com.DecklyBuy.Backend.users;

public record ProfileUpdateRequest(
        String nombre,
        String apellido,
        String nombreUsuario,
        String numeroContacto,
        String password,
        String confirmPassword
) {}
