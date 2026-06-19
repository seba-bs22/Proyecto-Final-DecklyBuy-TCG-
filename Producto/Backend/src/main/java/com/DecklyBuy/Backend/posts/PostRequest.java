package com.DecklyBuy.Backend.posts;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * DTO para crear un nuevo Post.
 */
public record PostRequest(
        @NotBlank(message = "El nombre no puede estar vacío")
        String nombre,

        String edicion,
        String numero,

        @Positive(message = "El precio debe ser mayor a 0")
        Double precio,

        String estadoDetectado,

        @NotBlank(message = "La URL de la imagen no puede estar vacía")
        String imagenUrl,


        @Size(max = 1000, message = "La descripción no puede superar los 1000 caracteres")
        String descripcion
) {}
