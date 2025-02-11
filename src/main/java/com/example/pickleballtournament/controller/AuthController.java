package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.request.AuthRequest;
import com.example.pickleballtournament.request.SignupRequest;
import com.example.pickleballtournament.response.AuthResponse;
import com.example.pickleballtournament.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/login")
    public ResponseEntity<String> loginInfo() {
        return ResponseEntity.ok("This is an API endpoint. Please use a POST request to log in.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            AuthResponse response = authService.authenticateUser(authRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {
        try {
            String message = authService.registerUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
