package com.DecklyBuy.Backend.controller;

import com.DecklyBuy.Backend.posts.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // Crear publicacion (Sin @Valid para evitar el cuelgue por cascade)
    @PostMapping
    public ResponseEntity<PostApiResponse> crearPost(@RequestBody PostRequest request,
                                                     HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(401).body(new PostApiResponse("No hay sesion activa", null));
        }

        // Validaciones manuales ultraseguras
        if (request.precio() == null || request.precio() <= 0) {
            return ResponseEntity.badRequest().body(new PostApiResponse("El precio debe ser mayor a 0", null));
        }
        if (request.categoriaCarta() == null || request.categoriaCarta().isBlank()) {
            return ResponseEntity.badRequest().body(new PostApiResponse("La categoría de la carta es obligatoria", null));
        }
        // ─── VALIDACIÓN MANUAL AGREGADA PARA EL IDIOMA ───
        if (request.idioma() == null || request.idioma().isBlank()) {
            return ResponseEntity.badRequest().body(new PostApiResponse("El idioma de la carta es obligatorio", null));
        }
        if (request.card() == null || request.card().getId() == null || request.card().getName() == null) {
            return ResponseEntity.badRequest().body(new PostApiResponse("La información oficial de la carta está incompleta", null));
        }

        UUID userId = (UUID) session.getAttribute("AUTH_USER_ID");
        PostResponse saved = postService.createPost(request, userId);
        return ResponseEntity.ok(new PostApiResponse("Post creado correctamente", saved));
    }

    // Listar las publicaciones exclusivas del usuario autenticado actual
    @GetMapping("/me")
    public ResponseEntity<PostApiResponse> listarMisPosts(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("AUTH_USER_ID") == null) {
            return ResponseEntity.status(401).body(new PostApiResponse("No hay sesion activa", null));
        }

        UUID userId = (UUID) session.getAttribute("AUTH_USER_ID");
        List<PostResponse> misPosts = postService.getPostsByUser(userId);
        return ResponseEntity.ok(new PostApiResponse("Mis posts recuperados exitosamente", misPosts));
    }

    // ─── MODIFICADO: Listar publicaciones generales con Filtros Dinámicos ───
    @GetMapping
    public ResponseEntity<PostApiResponse> listarPosts(
            @RequestParam(value = "categorias", required = false) String categoria,
            @RequestParam(value = "estado", required = false) String estado,
            @RequestParam(value = "ordenar", required = false) String ordenar,
            @RequestParam(value = "buscar", required = false) String buscar) {
        
        // Delegamos los filtros al servicio para que haga la magia
        List<PostResponse> posts = postService.getFilteredPosts(categoria, estado, ordenar, buscar);
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
                                                      @RequestBody PostUpdateRequest request,
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

    // Obtener todos los posts de venta asociados a una carta específica del catálogo
    @GetMapping("/card/{cardId}")
    public ResponseEntity<PostApiResponse> listarPostsPorCarta(@PathVariable String cardId) {
        try {
            List<PostResponse> posts = postService.getPostsByCardId(cardId);
            return ResponseEntity.ok(new PostApiResponse("Publicaciones encontradas para la carta " + cardId, posts));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new PostApiResponse("Error al buscar publicaciones: " + e.getMessage(), null));
        }
    }
}