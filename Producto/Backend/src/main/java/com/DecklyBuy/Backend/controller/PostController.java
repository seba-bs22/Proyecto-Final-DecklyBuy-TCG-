package com.DecklyBuy.Backend.controller;

import com.DecklyBuy.Backend.posts.Post;
import com.DecklyBuy.Backend.posts.PostRepository;
import com.DecklyBuy.Backend.posts.PostResponse;
import com.DecklyBuy.Backend.posts.PostUpdateRequest;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // Crear publicación
    @PostMapping
    public PostResponse crearPost(@RequestBody Post post) {
        Post saved = postRepository.save(post);
        return new PostResponse(saved);
    }

    // Listar publicaciones
    @GetMapping
    public List<PostResponse> listarPosts() {
        return postRepository.findAll()
                .stream()
                .map(PostResponse::new)
                .toList();
    }

    // Editar publicación
    @PutMapping("/{id}")
    public PostResponse editarPost(@PathVariable Long id, @RequestBody PostUpdateRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post no encontrado"));

        post.setNombre(request.getNombre());
        post.setEdicion(request.getEdicion());
        post.setNumero(request.getNumero());
        post.setPrecio(request.getPrecio());
        post.setEstadoDetectado(request.getEstadoDetectado());
        post.setImagenUrl(request.getImagenUrl());
        post.setDescripcion(request.getDescripcion());

        Post updated = postRepository.save(post);
        return new PostResponse(updated);
    }

    // Eliminar publicación
    @DeleteMapping("/{id}")
    public void eliminarPost(@PathVariable Long id) {
        postRepository.deleteById(id);
    }
}
