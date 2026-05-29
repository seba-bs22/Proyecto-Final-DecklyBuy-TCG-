package com.DecklyBuy.Backend.users;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "google_id")
    private String googleId;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellido")
    private String apellido;

    @Column(name = "nombre_usuario")
    private String nombreUsuario;

    @Column(name = "numero_contacto")
    private String numeroContacto;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "foto_perfil")
    private String fotoPerfil;

    @Column(name = "auth_provider")
    private String authProvider;

    @Column(name = "perfil_completo")
    private Boolean perfilCompleto;

    @Column(name = "rol")
    private String rol;

    @Column(name = "estado_cuenta")
    private String estadoCuenta;

    @Column(name = "fecha_creacion")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private OffsetDateTime fechaActualizacion;

    public User() {
    }

    public UUID getId() {
        return id;
    }

    public String getGoogleId() {
        return googleId;
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

    public String getPasswordHash() {
        return passwordHash;
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

    public void setId(UUID id) {
        this.id = id;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public void setNumeroContacto(String numeroContacto) {
        this.numeroContacto = numeroContacto;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public void setAuthProvider(String authProvider) {
        this.authProvider = authProvider;
    }

    public void setPerfilCompleto(Boolean perfilCompleto) {
        this.perfilCompleto = perfilCompleto;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public void setEstadoCuenta(String estadoCuenta) {
        this.estadoCuenta = estadoCuenta;
    }

    public void setFechaCreacion(OffsetDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public void setFechaActualizacion(OffsetDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
}