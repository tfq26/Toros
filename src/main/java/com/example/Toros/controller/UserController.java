package com.example.Toros.controller;

import com.example.Toros.DTO.UserProfileDto;
import com.example.Toros.model.User;
import com.example.Toros.model.Registration;
import com.example.Toros.repository.RegistrationRepository;
import com.example.Toros.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    // --- FIX 1: DECLARE THE REPOSITORY FIELD ---
    private final RegistrationRepository registrationRepository;

    // --- FIX 2: UPDATE THE CONSTRUCTOR TO INJECT BOTH DEPENDENCIES ---
    public UserController(UserService userService, RegistrationRepository registrationRepository) {
        this.userService = userService;
        this.registrationRepository = registrationRepository; // Now it's initialized!
    }

    /**
     * GET /api/users/me — Uses the Auth0 JWT to look up or create a user
     */
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No JWT presented");
        }
        String auth0Id = jwt.getSubject();
        log.debug("🔐 Auth0 ID from JWT: {}", auth0Id);
        User user = userService.getOrCreateByJwt(jwt);
        return ResponseEntity.ok(user);
    }

    /**
     * PATCH /api/users/me — Update the logged-in user’s profile
     */
    @PatchMapping("/me")
    public ResponseEntity<User> updateCurrentUser(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UserProfileDto updateRequest
    ) {
        if (jwt == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No JWT presented");
        }
        String auth0Id = jwt.getSubject();
        log.debug("🔄 Updating user (sub={}) with {}", auth0Id, updateRequest);
        User updated = userService.updateUserProfile(auth0Id, updateRequest);
        return ResponseEntity.ok(updated);
    }

    /**
     * GET /api/users/by-auth0?id={auth0Id} — A dedicated endpoint to find a user by their Auth0 ID.
     */
    @GetMapping("/by-auth0")
    public ResponseEntity<User> getUserByAuth0Id(@RequestParam("id") String auth0Id) {
        log.debug("🔎 Searching for user with auth0Id: {}", auth0Id);
        User user = userService.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with that Auth0 ID"));
        return ResponseEntity.ok(user);
    }

    /**
     * GET /api/users/{id} — Admin usage
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        // --- IMPROVEMENT: Added a "Not Found" check for consistency ---
        User user = userService.getUserById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with that internal ID"));
        return ResponseEntity.ok(user);
    }

    /**
     * GET /api/users/{userId}/registrations — Finds all registrations for a specific user.
     */
    @GetMapping("/{userId}/registrations")
    public ResponseEntity<List<Registration>> getRegistrationsByUserId(@PathVariable String userId) {
        log.debug("🔎 Finding registrations for userId: {}", userId);
        List<Registration> registrations = registrationRepository.findByUserId(userId);
        return ResponseEntity.ok(registrations);
    }
}