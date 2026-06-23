package com.DecklyBuy.Backend.posts;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * DTO para actualizar un Post existente.
 * Se permite editar todos los campos, incluida la imagen (imagenUrl).
 */
public record PostUpdateRequest(
        @NotBlank(message = "El nombre no puede estar vacío")
        String nombre,

        String edicion,
        String numero,

        @Positive(message = "El precio debe ser mayor a 0")
        Double precio,

        String estadoDetectado,

        @NotBlank(message = "La categoría de la carta es obligatoria")
        String categoriaCarta, // <-- Agregado para el flujo de edición

        @Size(max = 1000, message = "La descripción no puede superar los 1000 caracteres")
        String descripcion,

        String imagenUrl // ahora se puede actualizar la imagen
) {}