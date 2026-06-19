package com.DecklyBuy.Backend.users;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * DTO para devolver información de usuario en respuestas de API.
 */
public record UserResponse(
        UUID id,
        String nombre,
        String apellido,
        String nombreUsuario,
        String numeroContacto,
        String email,
        String fotoPerfil,
        String authProvider,
        Boolean perfilCompleto,
        String rol,
        String estadoCuenta,
        OffsetDateTime fechaCreacion,
        OffsetDateTime fechaActualizacion
) {
    public UserResponse(User user) {
        this(
            user.getId(),
            user.getNombre(),
            user.getApellido(),
            user.getNombreUsuario(),
            user.getNumeroContacto(),
            user.getEmail(),
            user.getFotoPerfil(),
            user.getAuthProvider(),
            user.getPerfilCompleto(),
            user.getRol(),
            user.getEstadoCuenta(),
            user.getFechaCreacion(),
            user.getFechaActualizacion()
        );
    }
}
