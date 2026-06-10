package com.DecklyBuy.Backend.posts;

public class PostResponse {
    private Long id;
    private String nombre;
    private String edicion;
    private String numero;
    private Double precio;
    private String estadoDetectado;
    private Integer score;
    private Double confidence;
    private String imagenUrl;
    private String descripcion;

    // Constructor que recibe la entidad Post
    public PostResponse(Post post) {
        this.id = post.getId();
        this.nombre = post.getNombre();
        this.edicion = post.getEdicion();
        this.numero = post.getNumero();
        this.precio = post.getPrecio();
        this.estadoDetectado = post.getEstadoDetectado();
        this.score = post.getScore();
        this.confidence = post.getConfidence();
        this.imagenUrl = post.getImagenUrl();
        this.descripcion = post.getDescripcion();
    }

    // Getters
    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEdicion() { return edicion; }
    public String getNumero() { return numero; }
    public Double getPrecio() { return precio; }
    public String getEstadoDetectado() { return estadoDetectado; }
    public Integer getScore() { return score; }
    public Double getConfidence() { return confidence; }
    public String getImagenUrl() { return imagenUrl; }
    public String getDescripcion() { return descripcion; }
}
