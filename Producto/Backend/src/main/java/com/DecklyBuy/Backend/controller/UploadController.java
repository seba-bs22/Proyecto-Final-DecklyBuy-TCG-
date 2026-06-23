package com.DecklyBuy.Backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://localhost:5173", allowCredentials = "true")
public class UploadController {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @PostMapping("/upload")
    @SuppressWarnings("null") 
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El archivo está vacío"));
            }

            String originalName = file.getOriginalFilename();
            if (originalName == null || originalName.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El archivo no tiene nombre"));
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Solo se permiten archivos de imagen"));
            }

            String bucket = "posts";
            String fileName = "images/" + System.currentTimeMillis() + "-" + originalName;
            
            // Lógica oficial de Supabase Storage API: POST se usa para crear nuevos objetos
            String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName;

            System.out.println("Intentando conectar con URL de Supabase: " + uploadUrl);

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseKey);
            headers.set("apikey", supabaseKey); 
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);

            // CORRECCIÓN: Se cambia HttpMethod.PUT a HttpMethod.POST
            ResponseEntity<String> response = restTemplate.exchange(uploadUrl, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                String publicUrl = supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;
                return ResponseEntity.ok(Map.of("url", publicUrl));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Supabase rechazó la subida con código: " + response.getStatusCode()));
            }
        } catch (org.springframework.web.client.HttpClientErrorException.NotFound ex) {
            System.err.println("❌ ERROR 404 DE SUPABASE: Verifica que el bucket 'posts' exista y sea público.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "El bucket o ruta especificada en Supabase no existe (404)."));
        } catch (org.springframework.web.client.ResourceAccessException ex) {
            System.err.println("❌ ERROR DE RED O SSL AL LLAMAR A SUPABASE: " + ex.getMessage());
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