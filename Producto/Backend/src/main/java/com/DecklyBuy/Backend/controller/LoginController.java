package com.DecklyBuy.Backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para manejar /login en caso de error.
 * Evita la Whitelabel Error Page devolviendo un mensaje controlado.
 */
@RestController
public class LoginController {

    @GetMapping("/login")
    public ResponseEntity<String> loginError(@RequestParam(required = false) String error) {
        String mensaje = "Error de login: " + (error != null ? error : "desconocido");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mensaje);
    }
}
