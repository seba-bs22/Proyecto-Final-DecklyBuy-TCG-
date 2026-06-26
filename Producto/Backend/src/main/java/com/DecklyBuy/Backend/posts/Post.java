package com.DecklyBuy.Backend.posts;

import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.apicard.Card;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Positive(message = "El precio debe ser mayor a 0")
    private Double precio;

    private String estadoDetectado;
    private Integer score;
    private Double confidence;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @Column(name = "categoria_carta", nullable = false)
    @NotBlank(message = "La categoría de la carta es obligatoria")
    private String categoriaCarta;

    @Column(nullable = false)
    @NotBlank(message = "El idioma de la carta es obligatorio")
    private String idioma;

    @Column(length = 1000)
    @Size(max = 1000, message = "La descripción no puede superar los 1000 caracteres")
    private String descripcion;

    @Column(name = "fecha_publicacion", nullable = false, updatable = false)
    private LocalDateTime fechaPublicacion;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"posts", "hibernateLazyInitializer", "handler"})
    private User user;

    @PrePersist
    public void prePersist() {
        this.fechaPublicacion = LocalDateTime.now();
        if (this.card != null) {
            this.card.setCategoriaCarta(this.categoriaCarta);
        }
    }

    @PreUpdate
    public void preUpdate() {
        if (this.card != null) {
            this.card.setCategoriaCarta(this.categoriaCarta);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public String getEstadoDetectado() { return estadoDetectado; }
    public void setEstadoDetectado(String estadoDetectado) { this.estadoDetectado = estadoDetectado; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public String getCategoriaCarta() { return categoriaCarta; }
    public void setCategoriaCarta(String categoriaCarta) { this.categoriaCarta = categoriaCarta; }

    public String getIdioma() { return idioma; }
    public void setIdioma(String idioma) { this.idioma = idioma; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getFechaPublicacion() { return fechaPublicacion; }
    public void setFechaPublicacion(LocalDateTime fechaPublicacion) { this.fechaPublicacion = fechaPublicacion; }

    public Card getCard() { return card; }
    public void setCard(Card card) { this.card = card; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}