package com.DecklyBuy.Backend.users;

import com.DecklyBuy.Backend.posts.Post;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "google_id", unique = true)
    private String googleId;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellido")
    private String apellido;

    @Column(name = "nombre_usuario", unique = true)
    private String nombreUsuario;

    @Column(name = "numero_contacto")
    private String numeroContacto;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "foto_perfil")
    private String fotoPerfil;

    @Column(name = "auth_provider", nullable = false)
    private String authProvider;

    @Column(name = "perfil_completo")
    private Boolean perfilCompleto = false;

    @Column(name = "rol", nullable = false)
    private String rol = "USER";

    @Column(name = "estado_cuenta", nullable = false)
    private String estadoCuenta = "ACTIVE";

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private OffsetDateTime fechaActualizacion;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private OffsetDateTime resetTokenExpiry;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();

    public User() {
        this.id = UUID.randomUUID();
        this.fechaCreacion = OffsetDateTime.now();
        this.estadoCuenta = "ACTIVE";
        this.rol = "USER";
        this.perfilCompleto = false;
    }

    public UUID getId() { return id; }
    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }
    public String getNumeroContacto() { return numeroContacto; }
    public void setNumeroContacto(String numeroContacto) { this.numeroContacto = numeroContacto; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getFotoPerfil() { return fotoPerfil; }
    public void setFotoPerfil(String fotoPerfil) { this.fotoPerfil = fotoPerfil; }
    public String getAuthProvider() { return authProvider; }
    public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }
    public Boolean getPerfilCompleto() { return perfilCompleto; }
    public void setPerfilCompleto(Boolean perfilCompleto) { this.perfilCompleto = perfilCompleto; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getEstadoCuenta() { return estadoCuenta; }
    public void setEstadoCuenta(String estadoCuenta) { this.estadoCuenta = estadoCuenta; }
    public OffsetDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(OffsetDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public OffsetDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(OffsetDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }
    public OffsetDateTime getResetTokenExpiry() { return resetTokenExpiry; }
    public void setResetTokenExpiry(OffsetDateTime resetTokenExpiry) { this.resetTokenExpiry = resetTokenExpiry; }

    public List<Post> getPosts() { return posts; }
    public void setPosts(List<Post> posts) { this.posts = posts; }
}