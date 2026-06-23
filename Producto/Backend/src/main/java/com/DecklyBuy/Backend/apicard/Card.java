package com.DecklyBuy.Backend.apicard;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    private String id; // El ID de la API (ej: "sv03-105")

    @Column(nullable = false)
    @NotBlank(message = "El nombre de la carta es obligatorio")
    private String name;

    private String edicion;

    @Column(name = "local_id")
    private String localId; // El número (ej: "105/167")

    private String image; // URL de la imagen oficial

    // Constructor vacío obligatorio para JPA
    public Card() {}

    // --- Getters y Setters ---
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