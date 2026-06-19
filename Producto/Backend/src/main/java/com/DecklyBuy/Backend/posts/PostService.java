package com.DecklyBuy.Backend.posts;

import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.users.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    // Listar todos los posts
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll().stream()
                .map(PostResponse::new)
                .toList();
    }

    // Obtener post por ID
    public PostResponse getPostById(Long id) {
        Objects.requireNonNull(id, "El id es obligatorio.");
        return postRepository.findById(id)
                .map(PostResponse::new)
                .orElseThrow(() -> new RuntimeException("Post no encontrado"));
    }

    // Crear post (con imagenUrl incluida)
    public PostResponse createPost(PostRequest request, UUID userId) {
        Objects.requireNonNull(userId, "El usuario es obligatorio.");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Post post = new Post();
        post.setNombre(request.nombre());
        post.setEdicion(request.edicion());
        post.setNumero(request.numero());
        post.setPrecio(request.precio());
        post.setEstadoDetectado(request.estadoDetectado());
        post.setImagenUrl(request.imagenUrl()); // guardar URL pública
        post.setDescripcion(request.descripcion());
        post.setUser(user);

        Post saved = postRepository.save(post);
        return new PostResponse(saved);
    }

    // Actualizar post (incluyendo imagenUrl si se cambia)
    public PostResponse updatePost(Long id, PostUpdateRequest request) {
        Objects.requireNonNull(id, "El id es obligatorio.");
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post no encontrado"));

        post.setNombre(request.nombre());
        post.setEdicion(request.edicion());
        post.setNumero(request.numero());
        post.setPrecio(request.precio());
        post.setEstadoDetectado(request.estadoDetectado());
        post.setDescripcion(request.descripcion());

        if (request.imagenUrl() != null && !request.imagenUrl().isBlank()) {
            post.setImagenUrl(request.imagenUrl());
        }

        Post updated = postRepository.save(post);
        return new PostResponse(updated);
    }

    // Eliminar post (y su imagen en Supabase)
    public void deletePost(Long id) {
        Objects.requireNonNull(id, "El id es obligatorio.");
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post no encontrado"));

        // Borrar imagen en Supabase si existe
        if (post.getImagenUrl() != null && !post.getImagenUrl().isBlank()) {
            try {
                String bucket = "posts";
                // Extraer la ruta completa después de "/posts/"
                String path = post.getImagenUrl().substring(post.getImagenUrl().indexOf(bucket) + bucket.length() + 1);
                String deleteUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + path;

                RestTemplate restTemplate = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", "Bearer " + supabaseKey);
                headers.set("apikey", supabaseKey);

                HttpEntity<Void> entity = new HttpEntity<>(headers);
                HttpMethod deleteMethod = Objects.requireNonNull(HttpMethod.DELETE);
                restTemplate.exchange(deleteUrl, deleteMethod, entity, Void.class);
            } catch (Exception e) {
                System.err.println("Error al borrar imagen en Supabase: " + e.getMessage());
            }
        }

        postRepository.deleteById(id);
    }

    // Listar posts de un usuario específico
    public List<PostResponse> getPostsByUser(UUID userId) {
        Objects.requireNonNull(userId, "Buscar usuario por ID");
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return postRepository.findByUser(user).stream()
                .map(PostResponse::new)
                .toList();
    }
}
