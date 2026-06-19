package com.DecklyBuy.Backend.users;

/**
 * DTO para actualizar el perfil de usuario.
 * Incluye nombre, apellido, nombre de usuario, contacto y credenciales.
 */
public record ProfileUpdateRequest(
        String nombre,
        String apellido,
        String nombreUsuario,
        String numeroContacto,
        String password,
        String confirmPassword
) {}
