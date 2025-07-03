package com.studentporta.controller;

import com.studentporta.config.JwtUtils;
import com.studentporta.dto.UserDTO;
import com.studentporta.entity.Role;
import com.studentporta.entity.User;
import com.studentporta.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userService.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userService.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user
        User user = new User(registerRequest.getUsername(),
                           registerRequest.getEmail(),
                           registerRequest.getPassword(),
                           registerRequest.getFirstName(),
                           registerRequest.getLastName(),
                           Role.STUDENT);
        user.setFaculty(registerRequest.getFaculty());
        // Store supervisor name as a string field
        if (registerRequest.getSupervisorName() != null && !registerRequest.getSupervisorName().trim().isEmpty()) {
            user.setSupervisorName(registerRequest.getSupervisorName());
        }

        try {
            userService.createUser(user);
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.getUserEntityByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));
            
            // Verify password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid credentials!"));
            }
            
            // Generate JWT token
            String token = jwtUtils.generateToken(user.getUsername());
            
            JwtResponse response = new JwtResponse(token, 
                                                  user.getId(), 
                                                  user.getUsername(), 
                                                  user.getEmail(), 
                                                  user.getRole());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid credentials!"));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        return ResponseEntity.ok("Backend is connected! CORS is working.");
    }

    // Inner classes for request/response objects
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private String faculty;
        private String supervisorName;

        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getFaculty() { return faculty; }
        public void setFaculty(String faculty) { this.faculty = faculty; }

        public String getSupervisorName() { return supervisorName; }
        public void setSupervisorName(String supervisorName) { this.supervisorName = supervisorName; }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String username;
        private String email;
        private Role role;
        private User user;

        public JwtResponse(String accessToken, Long id, String username, String email, Role role) {
            this.token = accessToken;
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
            // Create user object for frontend
            this.user = new User();
            this.user.setId(id);
            this.user.setUsername(username);
            this.user.setEmail(email);
            this.user.setRole(role);
        }

        // Getters and setters
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public String getAccessToken() { return token; }
        public void setAccessToken(String accessToken) { this.token = accessToken; }

        public String getTokenType() { return type; }
        public void setTokenType(String tokenType) { this.type = tokenType; }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }

        public User getUser() { return user; }
        public void setUser(User user) { this.user = user; }
    }
}
 