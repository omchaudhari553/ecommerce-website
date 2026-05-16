package com.springboot.service;

import com.springboot.dto.AuthResponse;
import com.springboot.dto.LoginRequest;
import com.springboot.dto.PasswordResetRequest;
import com.springboot.entity.User;
import com.springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Transactional
    public AuthResponse register(User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        // Trim and convert email to lowercase
        user.setEmail(user.getEmail().trim().toLowerCase());
        
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        
        // Validate password
        if (user.getPassword() == null || user.getPassword().trim().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }
        
        // Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Set default role if not specified
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("USER");
        }
        
        User savedUser = userRepository.save(user);
        return new AuthResponse(savedUser, "Registration successful");
    }
    
    public AuthResponse login(LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        final String email = loginRequest.getEmail().trim().toLowerCase();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        
        return new AuthResponse(user, "Login successful");
    }
    
    public AuthResponse adminLogin(LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        final String email = loginRequest.getEmail().trim().toLowerCase();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        
        if (!"ADMIN".equals(user.getRole().toUpperCase())) {
            throw new IllegalArgumentException("Unauthorized access. Admin privileges required.");
        }
        
        return new AuthResponse(user, "Login successful");
    }
    
    @Transactional
    public void resetPassword(PasswordResetRequest resetRequest) {
        if (resetRequest.getEmail() == null || resetRequest.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        // Trim email
        final String email = resetRequest.getEmail().trim().toLowerCase();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
        
        if (resetRequest.getNewPassword() == null || resetRequest.getNewPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("New password is required");
        }
        
        // In a real application, verify the reset token against a stored token
        // For this example, we'll just update the password
        user.setPassword(passwordEncoder.encode(resetRequest.getNewPassword()));
        userRepository.save(user);
    }
    
    public String generatePasswordResetToken(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        // Trim email
        final String trimmedEmail = email.trim().toLowerCase();
        
        User user = userRepository.findByEmail(trimmedEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + trimmedEmail));
        
        // Generate a random token
        String resetToken = UUID.randomUUID().toString();
        
        // In a real application, save this token to the database
        // and send it via email to the user
        
        return resetToken;
    }
}
