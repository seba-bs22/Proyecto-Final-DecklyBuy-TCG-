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
@CrossOrigin(origins = "https://localhost:5173", allowCredentials = "true")
public class UploadController {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @PostMapping("/upload")
    @SuppressWarnings("null") // Elimina las advertencias estrictas de Null Safety impuestas por el IDE
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
            String fileName = "images/" + System.currentTimeMillis() + "-" + originalName;
            String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName;

            // Log de control previo a la ejecución
            System.out.println("Intentando conectar con URL de Supabase: " + uploadUrl);

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseKey);
            headers.set("apikey", supabaseKey); 
            
            // MEJORA: Forzar APPLICATION_OCTET_STREAM para evitar rechazos binarios en la API REST de Supabase Storage
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);

            // Se ejecuta la llamada de forma limpia con la anotación de supresión de nulos activa
            ResponseEntity<String> response = restTemplate.exchange(uploadUrl, HttpMethod.PUT, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                String publicUrl = supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;
                return ResponseEntity.ok(Map.of("url", publicUrl));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Supabase rechazó la subida con código: " + response.getStatusCode()));
            }
        } catch (org.springframework.web.client.ResourceAccessException ex) {
            // MEJORA: Captura y traza explícita para fallas de red/SSL en la terminal de Java
            System.err.println("❌ ERROR DE RED O SSL AL LLAMAR A SUPABASE: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error de red/SSL con Supabase: " + ex.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ EXCEPCIÓN GENERAL EN UPLOAD: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Causa interna: " + e.getMessage()));
        }
    }
}