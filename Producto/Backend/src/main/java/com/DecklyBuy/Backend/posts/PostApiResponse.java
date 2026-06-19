package com.DecklyBuy.Backend.posts;

/**
 * Respuesta estándar para endpoints relacionados con publicaciones.
 */
public record PostApiResponse(
        String message,
        Object data // puede ser PostResponse, List<PostResponse> o null
) {}
