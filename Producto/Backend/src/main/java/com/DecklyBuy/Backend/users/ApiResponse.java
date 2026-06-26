package com.DecklyBuy.Backend.users;

public record ApiResponse(
        String message,
        UserResponse user
) {}