package com.springboot.dto;

import com.springboot.entity.User;

public class AuthResponse {
    private User user;
    private String message;
    private String status;

    public AuthResponse(User user, String message) {
        this.user = user;
        this.message = message;
        this.status = "success";
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
