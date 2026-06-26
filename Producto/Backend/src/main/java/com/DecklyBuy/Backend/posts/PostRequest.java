package com.DecklyBuy.Backend.posts;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record PostRequest(
        @NotNull(message = "La información de la carta oficial es obligatoria")
        CardDto card, 

        @NotNull(message = "El precio es obligatorio")
        @Positive(message = "El precio debe ser mayor a 0")
        Double precio,

        String estadoDetectado,
        Integer score,       
        Double confidence,   

        @NotBlank(message = "La URL de la imagen no puede estar vacía")
        String imagenUrl,

        @NotBlank(message = "La categoría de la carta es obligatoria")
        String categoriaCarta, 

        @NotBlank(message = "El idioma de la carta es obligatorio")
        String idioma,

        @Size(max = 1000, message = "La descripción no puede superar los 1000 caracteres")
        String descripcion
) {
    public static class CardDto {
        private String id;
        private String name;
        private String edicion;
        private String localId;
        private String image;

        public CardDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEdicion() { return edicion; }
        public void setEdicion(String edicion) { this.edicion = edicion; }

        public String getLocalId() { return localId; }
        public void setLocalId(String localId) { this.localId = localId; }

        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }
    }
}