package com.DecklyBuy.Backend.posts;

import com.DecklyBuy.Backend.users.User;
import com.DecklyBuy.Backend.users.UserRepository;
import com.DecklyBuy.Backend.apicard.Card;
import com.DecklyBuy.Backend.apicard.CardRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CardRepository cardRepository;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    public PostService(PostRepository postRepository, UserRepository userRepository, CardRepository cardRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.cardRepository = cardRepository;
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAll().stream()
                .map(PostResponse::new)
                .toList();
    }

    public PostResponse getPostById(Long id) {
        Objects.requireNonNull(id, "El id es obligatorio.");
        return postRepository.findById(id)
                .map(PostResponse::new)
                .orElseThrow(() -> new RuntimeException("Post no encontrado"));
    }

    @Transactional
    public PostResponse createPost(PostRequest request, UUID userId) {
        Objects.requireNonNull(userId, "El usuario es obligatorio.");
        if (request.card() == null || request.card().getId() == null) {
            throw new RuntimeException("La información de la carta oficial es obligatoria.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        PostRequest.CardDto cardDto = request.card();
        String cardId = Objects.requireNonNull(cardDto.getId(), "La información de la carta oficial es obligatoria.");
        Card cardToAssociate = cardRepository.findById(cardId)
                .orElseGet(() -> {
                    Card newCard = new Card();
                    newCard.setId(cardId);
                    newCard.setName(cardDto.getName());
                    newCard.setEdicion(cardDto.getEdicion());
                    newCard.setLocalId(cardDto.getLocalId());
                    newCard.setImage(cardDto.getImage());
                    return cardRepository.save(newCard);
                });

        Post post = new Post();
        post.setPrecio(request.precio());
        post.setScore(request.score());
        post.setConfidence(request.confidence());
        post.setEstadoDetectado(request.estadoDetectado());
        post.setImagenUrl(request.imagenUrl()); 
        post.setCategoriaCarta(request.categoriaCarta()); 
        post.setIdioma(request.idioma());
        post.setDescripcion(request.descripcion());
        post.setCard(cardToAssociate); 
        post.setUser(user);

        Post saved = postRepository.save(post);
        return new PostResponse(saved);
    }

    @Transactional
    public PostResponse updatePost(Long id, PostUpdateRequest request, UUID userId) {
        Objects.requireNonNull(id, "El id es obligatorio.");
        if (request.card() == null || request.card().getId() == null) {
            throw new RuntimeException("La información de la carta oficial es obligatoria.");
        }

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post no encontrado"));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tienes permisos para editar esta publicacion.");
        }

        PostUpdateRequest.CardDto cardDto = request.card();
        String cardId = Objects.requireNonNull(cardDto.getId(), "La información de la carta oficial es obligatoria.");
        Card cardToAssociate = cardRepository.findById(cardId)
                .orElseGet(() -> {
                    Card newCard = new Card();
                    newCard.setId(cardId);
                    newCard.setName(cardDto.getName());
                    newCard.setEdicion(cardDto.getEdicion());
                    newCard.setLocalId(cardDto.getLocalId());
                    newCard.setImage(cardDto.getImage());
                    return cardRepository.save(newCard);
                });

        post.setPrecio(request.precio());
        post.setScore(request.score());
        post.setConfidence(request.confidence());
        post.setEstadoDetectado(request.estadoDetectado());
        post.setCategoriaCarta(request.categoriaCarta()); 
        post.setDescripcion(request.descripcion());
        post.setCard(cardToAssociate); 

        if (request.idioma() != null && !request.idioma().isBlank()) {
            post.setIdioma(request.idioma());
        }

        if (request.imagenUrl() != null && !request.imagenUrl().isBlank()) {
            post.setImagenUrl(request.imagenUrl());
        }

        Post updated = postRepository.save(post);
        return new PostResponse(updated);
    }

    @Transactional
    public void deletePost(Long id, UUID userId) {
        Objects.requireNonNull(id, "El id es obligatorio.");
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post no encontrado"));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tienes permisos para eliminar esta publicacion.");
        }

        if (post.getImagenUrl() != null && !post.getImagenUrl().isBlank()) {
            try {
                String bucket = "posts";
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

    public List<PostResponse> getPostsByUser(UUID userId) {
        Objects.requireNonNull(userId, "Buscar usuario por ID");
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return postRepository.findByUser(user).stream()
                .map(PostResponse::new)
                .toList();
    }

    public List<PostResponse> getPostsByCardId(String cardId) {
        Objects.requireNonNull(cardId, "El cardId es obligatorio.");
        return postRepository.findByCard_Id(cardId).stream()
                .map(PostResponse::new)
                .toList();
    }

    public List<PostResponse> getFilteredPosts(String categoria, String estado, String ordenar, String buscar) {
        Stream<Post> postStream = postRepository.findAll().stream();

        if (categoria != null && !categoria.isBlank() && !categoria.equalsIgnoreCase("TODOS")) {
            postStream = postStream.filter(p -> p.getCategoriaCarta() != null 
                    && p.getCategoriaCarta().equalsIgnoreCase(categoria));
        }

        if (estado != null && !estado.isBlank() && !estado.equalsIgnoreCase("TODOS")) {
            postStream = postStream.filter(p -> p.getEstadoDetectado() != null 
                    && p.getEstadoDetectado().equalsIgnoreCase(estado));
        }

        if (buscar != null && !buscar.isBlank()) {
            String criterio = buscar.toLowerCase();
            postStream = postStream.filter(p -> 
                (p.getCard() != null && p.getCard().getName() != null && p.getCard().getName().toLowerCase().contains(criterio)) ||
                (p.getDescripcion() != null && p.getDescripcion().toLowerCase().contains(criterio))
            );
        }

        if (ordenar != null && !ordenar.isBlank() && !ordenar.equalsIgnoreCase("TODOS")) {
            switch (ordenar) {
                case "precio_asc" -> postStream = postStream.sorted((p1, p2) -> Double.compare(p1.getPrecio(), p2.getPrecio()));
                case "precio_desc" -> postStream = postStream.sorted((p1, p2) -> Double.compare(p2.getPrecio(), p1.getPrecio()));
                case "score_desc" -> postStream = postStream.sorted((p1, p2) -> Integer.compare(p2.getScore() != null ? p2.getScore() : 0, p1.getScore() != null ? p1.getScore() : 0));
                default -> { }
            }
        }

        return postStream.map(PostResponse::new).toList();
    }
}