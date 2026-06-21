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
@CrossOrigin(origins = "https://localhost:5173", allowCredentials = "true")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Crear publicacion
    @PostMapping
    public ResponseEntity<PostApiResponse> crearPost(@Valid @RequestBody PostRequest request,
                                                     HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(401).body(new PostApiResponse("No hay sesion activa", null));
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

    // Obtener publicacion por ID
    @GetMapping("/{id}")
    public ResponseEntity<PostApiResponse> obtenerPost(@PathVariable Long id) {
        PostResponse post = postService.getPostById(id);
        return ResponseEntity.ok(new PostApiResponse("Post encontrado", post));
    }

    // Editar publicacion
    @PutMapping("/{id}")
    public ResponseEntity<PostApiResponse> editarPost(@PathVariable Long id,
                                                      @Valid @RequestBody PostUpdateRequest request,
                                                      HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(401).body(new PostApiResponse("No hay sesion activa", null));
        }

        UUID userId = (UUID) session.getAttribute("AUTH_USER_ID");
        
        try {
            PostResponse updated = postService.updatePost(id, request, userId);
            return ResponseEntity.ok(new PostApiResponse("Post actualizado correctamente", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(new PostApiResponse(e.getMessage(), null));
        }
    }

    // Eliminar publicacion
    @DeleteMapping("/{id}")
    public ResponseEntity<PostApiResponse> eliminarPost(@PathVariable Long id,
                                                        HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(401).body(new PostApiResponse("No hay sesion activa", null));
        }

        UUID userId = (UUID) session.getAttribute("AUTH_USER_ID");

        try {
            postService.deletePost(id, userId);
            return ResponseEntity.ok(new PostApiResponse("Post eliminado correctamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(new PostApiResponse(e.getMessage(), null));
        }
    }
}