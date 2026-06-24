package com.DecklyBuy.Backend.posts;

import java.time.LocalDateTime;
import java.util.UUID;

public record PostResponse(
        Long id,
        String cardId,         
        String nombre,         
        String edicion,        
        String numero,         
        String cardImage,      
        Double precio,
        String estadoDetectado,
        Integer score,
        Double confidence,
        String imagenUrl,      
        String categoriaCarta, 
        // ─── PROPIEDAD AGREGADA EN LA FIRMA DEL RECORD ───
        String idioma,
        String descripcion,
        LocalDateTime fechaPublicacion,
        UUID userId,
        String nombreUsuario,
        String nombreAlign,
        String apellidoAutor
) {
    public PostResponse(Post post) {
        this(
            post.getId(),
            post.getCard() != null ? post.getCard().getId() : null,
            post.getCard() != null ? post.getCard().getName() : null,
            post.getCard() != null ? post.getCard().getEdicion() : null,
            post.getCard() != null ? post.getCard().getLocalId() : null,
            post.getCard() != null ? post.getCard().getImage() : null,
            post.getPrecio(),
            post.getEstadoDetectado(),
            post.getScore(),
            post.getConfidence(),
            post.getImagenUrl(),
            post.getCategoriaCarta(), 
            // ─── MAPEO DESDE LA ENTIDAD AGREGADO AQUÍ ───
            post.getIdioma(),
            post.getDescripcion(),
            post.getFechaPublicacion(),
            post.getUser() != null ? post.getUser().getId() : null,
            post.getUser() != null ? post.getUser().getNombreUsuario() : null,
            post.getUser() != null ? post.getUser().getNombre() : null,
            post.getUser() != null ? post.getUser().getApellido() : null
        );
    }
}