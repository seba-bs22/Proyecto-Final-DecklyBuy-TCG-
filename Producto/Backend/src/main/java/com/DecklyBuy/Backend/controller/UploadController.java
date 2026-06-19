package com.DecklyBuy.Backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Controlador para subir archivos a Supabase Storage.
 * Solo se permite subir imágenes, y devuelve la URL pública.
 */
@RestController
@RequestMapping("/api")
public class UploadController {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Validación básica
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El archivo está vacío"));
            }

            String originalName = file.getOriginalFilename();
            if (originalName == null || originalName.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El archivo no tiene nombre"));
            }

            // Validar tipo de archivo (solo imágenes)
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Solo se permiten archivos de imagen"));
            }

            String bucket = "posts";
            // Guardar dentro de un folder "images/"
            String fileName = "images/" + System.currentTimeMillis() + "-" + originalName;
            String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName;

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseKey);
            headers.set("apikey", supabaseKey); // cabecera adicional requerida
            headers.setContentType(MediaType.valueOf(contentType));

            HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);

            // IMPORTANTE: usar PUT
            ResponseEntity<String> response = restTemplate.exchange(uploadUrl, Objects.requireNonNull(HttpMethod.PUT), entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                // URL pública para guardar en el Post
                String publicUrl = supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;
                return ResponseEntity.ok(Map.of("url", publicUrl));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Error al subir imagen: " + response.getStatusCode()));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Excepción: " + e.getMessage()));
        }
    }
}
