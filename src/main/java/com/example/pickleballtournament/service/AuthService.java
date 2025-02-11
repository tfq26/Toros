package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.User;
import com.example.pickleballtournament.repository.UserRepository;
import com.example.pickleballtournament.request.AuthRequest;
import com.example.pickleballtournament.request.SignupRequest;
import com.example.pickleballtournament.response.AuthResponse;
import com.example.pickleballtournament.utility.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Handles user authentication and token generation.
     */
    public AuthResponse authenticateUser(AuthRequest authRequest) {
        try {
            Authentication authentication;
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );

            String token = jwtUtil.generateToken(authRequest.getUsername());
            return new AuthResponse(token);

        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid username or password.");
        }
    }

    /**
     * Handles user registration with validation.
     */
    public String registerUser(SignupRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken.");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered.");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match.");
        }
        if (!request.isTosAccepted()) {
            throw new RuntimeException("You must accept the Terms of Service.");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

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

        return "User registered successfully!";
    }
}
