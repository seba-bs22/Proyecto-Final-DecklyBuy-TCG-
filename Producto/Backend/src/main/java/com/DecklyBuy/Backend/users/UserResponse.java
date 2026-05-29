package com.DecklyBuy.Backend.users;

import java.time.OffsetDateTime;
import java.util.UUID;

public class UserResponse {

    private UUID id;
    private String nombre;
    private String apellido;
    private String nombreUsuario;
    private String numeroContacto;
    private String email;
    private String fotoPerfil;
    private String authProvider;
    private Boolean perfilCompleto;
    private String rol;
    private String estadoCuenta;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaActualizacion;

    public UserResponse(User user) {
        this.id = user.getId();
        this.nombre = user.getNombre();
        this.apellido = user.getApellido();
        this.nombreUsuario = user.getNombreUsuario();
        this.numeroContacto = user.getNumeroContacto();
        this.email = user.getEmail();
        this.fotoPerfil = user.getFotoPerfil();
        this.authProvider = user.getAuthProvider();
        this.perfilCompleto = user.getPerfilCompleto();
        this.rol = user.getRol();
        this.estadoCuenta = user.getEstadoCuenta();
        this.fechaCreacion = user.getFechaCreacion();
        this.fechaActualizacion = user.getFechaActualizacion();
    }

    public UUID getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public String getNumeroContacto() {
        return numeroContacto;
    }

    public String getEmail() {
        return email;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public String getAuthProvider() {
        return authProvider;
    }

    public Boolean getPerfilCompleto() {
        return perfilCompleto;
    }

    public String getRol() {
        return rol;
    }

    public String getEstadoCuenta() {
        return estadoCuenta;
    }

    public OffsetDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public OffsetDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }
}