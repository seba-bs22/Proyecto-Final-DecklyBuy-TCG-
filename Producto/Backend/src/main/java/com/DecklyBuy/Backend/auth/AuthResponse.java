package com.DecklyBuy.Backend.auth;

import com.DecklyBuy.Backend.users.UserResponse;

public class AuthResponse {

    private String message;
    private UserResponse user;

    public AuthResponse() {
    }

    public AuthResponse(String message, UserResponse user) {
        this.message = message;
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }
}