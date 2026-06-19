package com.DecklyBuy.Backend.controller;

import com.DecklyBuy.Backend.posts.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Crear publicación
    @PostMapping
    public ResponseEntity<PostApiResponse> crearPost(@Valid @RequestBody PostRequest request,
                                                     HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(401).body(new PostApiResponse("No hay sesión activa", null));
        }

        UUID userId = (UUID) session.getAttribute("AUTH_USER_ID");
        PostResponse saved = postService.createPost(request, userId);
        return ResponseEntity.ok(new PostApiResponse("Post creado correctamente", saved));
    }

    // Listar publicaciones
    @GetMapping
    public ResponseEntity<PostApiResponse> listarPosts() {
        List<PostResponse> posts = postService.getAllPosts();
        return ResponseEntity.ok(new PostApiResponse("Lista de posts", posts));
    }

    // Obtener publicación por ID
    @GetMapping("/{id}")
    public ResponseEntity<PostApiResponse> obtenerPost(@PathVariable Long id) {
        PostResponse post = postService.getPostById(id);
        return ResponseEntity.ok(new PostApiResponse("Post encontrado", post));
    }

    // Editar publicación (incluye imagenUrl si se cambia)
    @PutMapping("/{id}")
    public ResponseEntity<PostApiResponse> editarPost(@PathVariable Long id,
                                                      @Valid @RequestBody PostUpdateRequest request) {
        PostResponse updated = postService.updatePost(id, request);
        return ResponseEntity.ok(new PostApiResponse("Post actualizado correctamente", updated));
    }

    // Eliminar publicación (y su imagen en Supabase)
    @DeleteMapping("/{id}")
    public ResponseEntity<PostApiResponse> eliminarPost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok(new PostApiResponse("Post eliminado correctamente", null));
    }
}
