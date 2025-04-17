package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Tournament;
import com.example.pickleballtournament.request.TournamentSetupRequest;
import com.example.pickleballtournament.service.TournamentSetupService;
import com.example.pickleballtournament.service.TournamentService;
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

    /** 🎯 Setup Tournament with Extended Properties */
    @PostMapping("/setup")
    public ResponseEntity<?> setupTournament(@RequestBody TournamentSetupRequest request) {
        try {
            log.info("🛠️ Setting up tournament: {}", request.getTournamentName());
            Tournament tournament = tournamentSetupService.setupTournament(
                    request.getTournamentName(),
                    request.getNumCourts(),
                    request.getGamesPerTeam(),
                    request.isSkillBased(),
                    request.getStartTime(),
                    request.getMatchDuration(),
                    request.getBreakTime(),
                    request.getConfirmDelete(),
                    request.getLocation(),
                    request.getOrganizer(),
                    request.getContactInfo(),
                    request.getTournamentType(),
                    request.getScoringSystem(),
                    request.getRules(),
                    request.getPrizeDistribution(),
                    request.getFormat(),
                    request.getAgeGroup(),
                    request.getSkillLevel()
            );

            if (tournament == null) {
                log.warn("Tournament setup aborted due to duplicate tournament.");
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Tournament with the given name already exists and deletion was not confirmed.");
            }

            log.info("✅ Tournament '{}' setup successfully!", tournament.getName());
            return ResponseEntity.ok(tournament);
        } catch (Exception e) {
            log.error("❌ Error setting up tournament: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to setup tournament.");
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
}
