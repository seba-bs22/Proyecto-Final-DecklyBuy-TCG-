package com.DecklyBuy.Backend.posts;

public class PostUpdateRequest {
    private String nombre;
    private String edicion;
    private String numero;
    private Double precio;
    private String estadoDetectado;
    private String imagenUrl;
    private String descripcion;

    public PostUpdateRequest() {}

    // Getters y setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEdicion() { return edicion; }
    public void setEdicion(String edicion) { this.edicion = edicion; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public String getEstadoDetectado() { return estadoDetectado; }
    public void setEstadoDetectado(String estadoDetectado) { this.estadoDetectado = estadoDetectado; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
