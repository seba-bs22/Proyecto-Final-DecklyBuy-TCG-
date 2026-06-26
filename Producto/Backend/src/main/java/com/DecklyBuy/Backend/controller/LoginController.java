package com.DecklyBuy.Backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class LoginController {

    @GetMapping("/login")
    public ResponseEntity<String> loginError(@RequestParam(required = false) String error) {
        String mensaje = "Error de login: " + (error != null ? error : "desconocido");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mensaje);
    }
}