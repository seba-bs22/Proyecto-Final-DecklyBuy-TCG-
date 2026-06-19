package com.DecklyBuy.Backend.posts;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO para devolver información de un Post en respuestas de API.
 */
public record PostResponse(
        Long id,
        String nombre,
        String edicion,
        String numero,
        Double precio,
        String estadoDetectado,
        Integer score,
        Double confidence,
        String imagenUrl,
        String descripcion,
        LocalDateTime fechaPublicacion,
        UUID userId,
        String nombreUsuario,
        String nombreAutor,
        String apellidoAutor
) {
    // Constructor auxiliar que recibe la entidad Post
    public PostResponse(Post post) {
        this(
            post.getId(),
            post.getNombre(),
            post.getEdicion(),
            post.getNumero(),
            post.getPrecio(),
            post.getEstadoDetectado(),
            post.getScore(),
            post.getConfidence(),
            post.getImagenUrl(),
            post.getDescripcion(),
            post.getFechaPublicacion(),
            post.getUser() != null ? post.getUser().getId() : null,
            post.getUser() != null ? post.getUser().getNombreUsuario() : null,
            post.getUser() != null ? post.getUser().getNombre() : null,
            post.getUser() != null ? post.getUser().getApellido() : null
        );
    }
}
