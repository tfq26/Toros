package com.example.Toros.controller;

import com.example.Toros.model.Tournament;
import com.example.Toros.model.User;
import com.example.Toros.request.TournamentSetupRequest;
import com.example.Toros.service.TournamentSetupService;
import com.example.Toros.service.TournamentService;
import com.example.Toros.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/tournaments")
@CrossOrigin(origins = "http://localhost:5173")
public class TournamentController {

    private final TournamentSetupService tournamentSetupService;
    private final TournamentService tournamentService;
    private final UserService userService;

    public TournamentController(TournamentSetupService tournamentSetupService,
                                TournamentService tournamentService,
                                UserService userService){
        this.tournamentSetupService = tournamentSetupService;
        this.tournamentService = tournamentService;
        this.userService = userService;
    }

    @GetMapping("/my")
    public ResponseEntity<List<Tournament>> getMyTournaments(@AuthenticationPrincipal Jwt principal) {
        String auth0Id = principal.getSubject();
        log.info("Fetching tournaments for organizer with Auth0 ID: {}", auth0Id);
        List<Tournament> tournaments = tournamentService.findTournamentsByOrganizerId(auth0Id);
        return ResponseEntity.ok(tournaments);
    }

    @PostMapping("/setup")
    public ResponseEntity<?> setupTournament(@RequestBody TournamentSetupRequest request) {
        try {
            log.info("🛠️ Received request to set up tournament: {}", request.getTournamentName());
            Tournament tournament = tournamentSetupService.setupTournament(request);
            if (tournament == null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("A tournament with this name already exists.");
            }
            log.info("✅ Tournament '{}' setup successfully!", tournament.getName());
            return ResponseEntity.ok(tournament);
        } catch (Exception e) {
            log.error("❌ Error setting up tournament: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to set up the tournament due to an internal error.");
        }
    }

    @GetMapping("/{tournamentId}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable String tournamentId) {
        return tournamentService.getTournamentById(tournamentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{tournamentId}/end")
    public ResponseEntity<String> endTournament(@PathVariable String tournamentId) {
        try {
            tournamentService.endTournament(tournamentId);
            return ResponseEntity.ok("Tournament ended successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to end tournament.");
        }
    }

    @GetMapping("/registered")
    public ResponseEntity<List<Tournament>> getRegisteredTournaments(@AuthenticationPrincipal Jwt principal) {
        String auth0Id = principal.getSubject();
        // The 'User' class is now correctly imported, and '.getId()' can be resolved.
        User appUser = userService.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application user not found"));

        List<Tournament> list = tournamentService.getTournamentsForUser(appUser.getId());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        // ... (this method is fine) ...
        try {
            String tournamentId = payload.get("tournamentId");
            String userId = payload.get("userId");
            if (tournamentId == null || userId == null) {
                return ResponseEntity.badRequest().body("Missing tournamentId or userId");
            }
            Tournament updated = tournamentService.register(tournamentId, userId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    @GetMapping("/active")
    public ResponseEntity<List<Tournament>> getActiveTournaments() {
        // ✨ FIX 2: Calling the new, more explicit service method
        List<Tournament> list = tournamentService.getTournamentsByStatus("ACTIVE");
        if (list.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        // ✨ FIX 3: Calling the new service method for getting all tournaments
        List<Tournament> tournaments = tournamentService.getAllTournaments();
        if (tournaments.isEmpty()) {
            log.info("📂 No tournaments found.");
        }
        return ResponseEntity.ok(tournaments);
    }


    /** 🎯 Get Registered and Unregistered Tournaments for a User */
    @GetMapping("/status/{userId}")
    public ResponseEntity<Map<String, List<Tournament>>> getUserTournamentStatus(@PathVariable String userId) {
        try {
            List<Tournament> allTournaments = tournamentService.getAllTournaments();
            List<Tournament> registered = tournamentService.getTournamentsForUser(userId);

            // Filter out registered ones to get unregistered
            List<Tournament> unregistered = allTournaments.stream()
                    .filter(t -> registered.stream().noneMatch(r -> r.getId().equals(t.getId())))
                    .toList();

            Map<String, List<Tournament>> response = Map.of(
                    "registered", registered,
                    "unregistered", unregistered
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ Failed to get tournament status for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of());
        }
    }
}
