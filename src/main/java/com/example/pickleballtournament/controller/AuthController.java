package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.User;
import com.example.pickleballtournament.repository.UserRepository;
import com.example.pickleballtournament.request.AuthRequest;
import com.example.pickleballtournament.request.SignupRequest;
import com.example.pickleballtournament.response.AuthResponse;
import com.example.pickleballtournament.utility.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend requests
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ Fix: Handle GET requests for /auth/login (to prevent 405 errors)
    @GetMapping("/login")
    public ResponseEntity<String> loginInfo() {
        return ResponseEntity.ok("Please use a POST request to log in.");
    }

    // ✅ POST method for authentication
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        logger.info("Login attempt for user: {}", authRequest.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );

            String token = jwtUtil.generateToken(authRequest.getUsername());
            logger.info("Login successful for user: {}", authRequest.getUsername());
            return ResponseEntity.ok(new AuthResponse(token));

        } catch (AuthenticationException e) {
            logger.error("Login failed for user: {} - Error: {}", authRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    // ✅ NEW: Register a new user
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {
        logger.info("Signup attempt for username: {}", request.getUsername());

        // ✅ Check if username or email already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken.");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already registered.");
        }

        // ✅ Validate password matching
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match.");
        }

        // ✅ Check if Terms of Service was accepted
        if (!request.isTosAccepted()) {
            return ResponseEntity.badRequest().body("You must accept the Terms of Service.");
        }

        // ✅ Hash password before storing
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // ✅ Create and save the new user
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());
        newUser.setEmail(request.getEmail());
        newUser.setPhone(request.getPhone());
        newUser.setPassword(hashedPassword);
        newUser.setRole("USER");
        newUser.setEnabled(true);

        userRepository.save(newUser);

        logger.info("User registered successfully: {}", request.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
    }
}
