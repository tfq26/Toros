package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Tournament;
import com.example.pickleballtournament.request.TournamentSetupRequest;
import com.example.pickleballtournament.request.UpdateMatchRequest;
import com.example.pickleballtournament.service.MatchService;
import com.example.pickleballtournament.service.TournamentSetupService;
import com.example.pickleballtournament.service.LiveTournamentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/tournament")
@CrossOrigin(origins = "http://localhost:5173")
public class TournamentController {

    private final TournamentSetupService tournamentSetupService;
    private final LiveTournamentService liveTournamentService;
    private final MatchService matchService;

    public TournamentController(TournamentSetupService tournamentSetupService,
                                LiveTournamentService liveTournamentService,
                                MatchService matchService) {
        this.tournamentSetupService = tournamentSetupService;
        this.liveTournamentService = liveTournamentService;
        this.matchService = matchService;
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

    /** 🎯 Get All Active Tournaments */
    @GetMapping("/activeTournament")
    public ResponseEntity<?> getActiveTournamentFull() {
        try {
            List<Tournament> activeTournaments = liveTournamentService.getTournaments(true);
            log.info("🎾 Active Tournaments retrieved: {}", activeTournaments.size());
            return ResponseEntity.ok(activeTournaments);
        } catch (Exception e) {
            log.error("❌ Error fetching active tournaments: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch active tournaments.");
        }
    }

    /** 🎯 Get Tournament by ID */
    @GetMapping("/{tournamentId}")
    public ResponseEntity<?> getTournamentById(@PathVariable String tournamentId) {
        Optional<Tournament> tournamentOpt = liveTournamentService.getTournamentById(tournamentId);
        if (tournamentOpt.isPresent()) {
            log.info("✅ Found tournament: {}", tournamentOpt.get().getName());
            return ResponseEntity.ok(tournamentOpt.get());
        } else {
            log.warn("⚠️ Tournament not found for ID: {}", tournamentId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tournament not found.");
        }
    }

    /** 🎯 Update Match using PATCH (explicit mapping) */
    @RequestMapping(value = "/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<?> updateMatch(@PathVariable String id, @RequestBody UpdateMatchRequest request) {
        try {
            log.info("📥 Received match update request: Match ID={}, Team1Score={}, Team2Score={}, Status={}",
                    id, request.getTeam1Score(), request.getTeam2Score(), request.getStatus());
            String updatedMatchId = matchService.updateMatch(id, request);
            log.info("✅ Match {} updated successfully.", id);
            return ResponseEntity.ok(updatedMatchId);
        } catch (IllegalArgumentException e) {
            log.warn("⚠️ Match update failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            log.error("❌ Error updating match {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update match.");
        }
    }

    /** 🎯 End Tournament */
    @PostMapping("/end")
    public ResponseEntity<String> endTournament() {
        try {
            liveTournamentService.endTournament();
            log.info("🏁 Live tournament has been ended.");
            return ResponseEntity.ok("Tournament ended successfully.");
        } catch (Exception e) {
            log.error("❌ Error ending tournament: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to end tournament.");
        }
    }

    /** 🎯 Get All Tournaments */
    @GetMapping("/all")
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        List<Tournament> tournaments = liveTournamentService.getTournaments(true);
        tournaments.addAll(liveTournamentService.getTournaments(false));
        if (tournaments.isEmpty()) {
            log.info("📂 No tournaments found.");
        }
        return ResponseEntity.ok(tournaments);
    }

    /** 🎯 Get Team Standings */
    @GetMapping("/standings")
    public ResponseEntity<List<String>> getTeamStandings() {
        List<String> standings = liveTournamentService.getStandings();
        return ResponseEntity.ok(standings);
    }

    /** 🎯 Get Matches by Tournament ID */
    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<?> getMatchesByTournament(@PathVariable String tournamentId) {
        try {
            List<String> matchIds = matchService.getMatchesByTournamentId(tournamentId);
            if (matchIds.isEmpty()) {
                log.warn("⚠️ No matches found for Tournament ID: {}", tournamentId);
                return ResponseEntity.ok(List.of());
            }
            return ResponseEntity.ok(matchIds);
        } catch (Exception e) {
            log.error("❌ Error fetching matches for Tournament ID {}: {}", tournamentId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch matches for tournament.");
        }
    }
}
