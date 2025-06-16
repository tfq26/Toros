package com.example.Toros.controller;

import com.example.Toros.model.Tournament;
import com.example.Toros.request.TournamentSetupRequest;
import com.example.Toros.service.TournamentSetupService;
import com.example.Toros.service.TournamentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/tournament")
@CrossOrigin(origins = "http://localhost:5173")
public class TournamentController {

    private final TournamentSetupService tournamentSetupService;
    private final TournamentService tournamentService;

    public TournamentController(TournamentSetupService tournamentSetupService,
                                TournamentService tournamentService){
        this.tournamentSetupService = tournamentSetupService;
        this.tournamentService = tournamentService;
    }

    /**
     * Creates a new tournament from a setup request.
     * ✨ FIXED: This method now correctly calls the refactored service method.
     * It accepts the request body and passes it directly to the service.
     */
    @PostMapping("/setup")
    public ResponseEntity<?> setupTournament(@RequestBody TournamentSetupRequest request) {
        try {
            log.info("🛠️ Received request to set up tournament: {}", request.getTournamentName());

            // This now passes the single request object to the service, resolving the error.
            Tournament tournament = tournamentSetupService.setupTournament(request);

            if (tournament == null) {
                log.warn("Tournament setup aborted due to a duplicate tournament name.");
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

    /** 🎯 Get Tournament by ID */
    @GetMapping("/{tournamentId}")
    public ResponseEntity<?> getTournamentById(@PathVariable String tournamentId) {
        Optional<Tournament> tournamentOpt = tournamentService.getTournamentById(tournamentId);
        if (tournamentOpt.isPresent()) {
            log.info("✅ Found tournament: {}", tournamentOpt.get().getName());
            return ResponseEntity.ok(tournamentOpt.get());
        } else {
            log.warn("⚠️ Tournament not found for ID: {}", tournamentId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tournament not found.");
        }
    }

    /** 🎯 End Tournament */
    @PostMapping("/end")
    public ResponseEntity<String> endTournament() {
        try {
            tournamentService.endTournament();
            log.info("🏁 Live tournament has been ended.");
            return ResponseEntity.ok("Tournament ended successfully.");
        } catch (Exception e) {
            log.error("❌ Error ending tournament: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to end tournament.");
        }
    }

    /** 🎯 Get only the tournaments the current user is registered in */
    @GetMapping("/registered")
    public ResponseEntity<List<Tournament>> getRegisteredTournaments(
            @AuthenticationPrincipal JwtAuthenticationToken authToken) {
        String userId = authToken.getName();  // the Auth0 user ID (sub)
        List<Tournament> list = tournamentService.getTournamentsForUser(userId);
        if (list.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(list);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        try {
            String tournamentId = payload.get("tournamentId");
            String userId = payload.get("userId");

            if (tournamentId == null || userId == null) {
                throw new IllegalArgumentException("Missing tournamentId or userId");
            }

            Tournament updated = tournamentService.register(tournamentId, userId);
            return ResponseEntity.ok(updated);
        } catch (IllegalStateException e) {
            log.warn("⚠️ Registration failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }

    @GetMapping("/active")
    public ResponseEntity<List<Tournament>> getActiveTournaments() {
        List<Tournament> list = tournamentService.getTournaments(true);
        if (list.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(list);
    }

    /** 🎯 Get All Tournaments */
    @GetMapping("/all")
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        List<Tournament> tournaments = tournamentService.getTournaments(true);
        tournaments.addAll(tournamentService.getTournaments(false));
        if (tournaments.isEmpty()) {
            log.info("📂 No tournaments found.");
        }
        return ResponseEntity.ok(tournaments);
    }

    /** 🎯 Get Registered and Unregistered Tournaments for a User */
    @GetMapping("/status/{userId}")
    public ResponseEntity<Map<String, List<Tournament>>> getUserTournamentStatus(@PathVariable String userId) {
        try {
            List<Tournament> allTournaments = tournamentService.getTournaments(true);
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
