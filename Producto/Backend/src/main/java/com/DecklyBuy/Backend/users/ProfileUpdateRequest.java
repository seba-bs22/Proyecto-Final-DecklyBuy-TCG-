package com.DecklyBuy.Backend.users;

public class ProfileUpdateRequest {

    private String nombre;
    private String apellido;
    private String nombreUsuario;
    private String numeroContacto;
    private String password;
    private String confirmPassword;

    public ProfileUpdateRequest() {
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

    public String getPassword() {
        return password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
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

    public void setPassword(String password) {
        this.password = password;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}