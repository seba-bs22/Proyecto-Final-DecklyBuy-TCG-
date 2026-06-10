package com.DecklyBuy.Backend.users;

public class ApiResponse {
    private String message;
    private UserResponse user;

    public ApiResponse(String message, UserResponse user) {
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
