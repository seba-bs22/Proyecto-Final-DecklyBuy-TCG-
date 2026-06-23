package com.DecklyBuy.Backend.posts;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record PostUpdateRequest(
        @NotNull(message = "La información de la carta oficial es obligatoria")
        CardDto card, 

        @NotNull(message = "El precio es obligatorio")
        @Positive(message = "El precio debe ser mayor a 0")
        Double precio,

        String estadoDetectado,
        Integer score,
        Double confidence,

        @Size(max = 1000, message = "La descripción no puede superar los 1000 caracteres")
        String descripcion,

        String imagenUrl, 

        String categoriaCarta
) {
    // Sub-clase DTO estática para transferir los datos de la carta de forma limpia al actualizar
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