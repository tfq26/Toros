package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.model.Tournament;
import com.example.pickleballtournament.request.TournamentSetupRequest;
import com.example.pickleballtournament.request.UpdateMatchRequest;
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
@CrossOrigin(origins = "http://localhost:5173") // ✅ Allow frontend requests
public class TournamentController {

    private final TournamentSetupService tournamentSetupService;
    private final LiveTournamentService liveTournamentService;

    public TournamentController(TournamentSetupService tournamentSetupService, LiveTournamentService liveTournamentService) {
        this.tournamentSetupService = tournamentSetupService;
        this.liveTournamentService = liveTournamentService;
    }

    /** 🎯 **Setup Tournament** */
    @PostMapping("/setup")
    public ResponseEntity<?> setupTournament(@RequestBody TournamentSetupRequest request) {
        try {
            log.info("🛠️ Setting up tournament: {}", request.getTournamentName());

            Tournament tournament = tournamentSetupService.setupTournament(
                    request.getTournamentName(),
                    request.getNumCourts(),
                    request.getGamesPerTeam(),
                    request.isUseExistingPlayers(),
                    request.isTiered(),
                    request.getStartTime(),
                    request.getMatchDuration()
            );

            log.info("✅ Tournament '{}' setup successfully!", tournament.getName());
            return ResponseEntity.ok(tournament);
        } catch (Exception e) {
            log.error("❌ Error setting up tournament: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to setup tournament.");
        }
    }

    /** 🎯 **Get Active Tournament** */
    @GetMapping("/active")
    public ResponseEntity<Object> getActiveTournament() {
        Optional<Tournament> tournament = liveTournamentService.getActiveTournament();

        return tournament.<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok("No active tournament."));
    }


    /** 🎯 **End Tournament** */
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

    /** 🎯 **Get All Tournaments** */
    @GetMapping("/all")
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        List<Tournament> tournaments = liveTournamentService.getAllTournaments();
        if (tournaments.isEmpty()) {
            log.info("📂 No tournaments found.");
        }
        return ResponseEntity.ok(tournaments);
    }

    /** 🎯 **Get Team Standings** */
    @GetMapping("/standings")
    public ResponseEntity<List<Team>> getTeamStandings() {
        List<Team> standings = liveTournamentService.getStandings();
        return ResponseEntity.ok(standings);
    }

    /** 🎯 **Get All Matches** */
    @GetMapping("/matches")
    public ResponseEntity<List<Match>> getAllMatches() {
        List<Match> matches = liveTournamentService.getAllMatches();
        if (matches.isEmpty()) {
            log.warn("⚠️ No matches found.");
            return ResponseEntity.ok().body(List.of());
        }

        matches.forEach(match -> log.info("📡 Match ID in response: {}", match.getId()));
        return ResponseEntity.ok(matches);
    }

    /** 🎯 **Get Matches by Team ID** */
    @GetMapping("/matches/team/{teamId}")
    public ResponseEntity<?> getMatchesByTeam(@PathVariable String teamId) {
        try {
            List<Match> matches = liveTournamentService.getMatchesByTeam(teamId);
            if (matches.isEmpty()) {
                log.warn("⚠️ No matches found for Team ID: {}", teamId);
                return ResponseEntity.ok().body(List.of());
            }
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            log.error("❌ Error fetching matches for Team ID {}: {}", teamId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch matches.");
        }
    }

    /** 🎯 **Update Match** */
    @PatchMapping("/match/{id}")
    public ResponseEntity<?> updateMatch(@PathVariable String id, @RequestBody UpdateMatchRequest request) {
        try {
            log.info("📥 Received match update request: Match ID={}, Team1Score={}, Team2Score={}, Status={}",
                    id, request.getTeam1Score(), request.getTeam2Score(), request.getStatus());

            if (request == null) {
                log.error("❌ Received null request body!");
                return ResponseEntity.badRequest().body("Invalid JSON request.");
            }

            Match updatedMatch = liveTournamentService.updateMatch(id, request);

            log.info("✅ Match {} updated successfully.", id);
            return ResponseEntity.ok(updatedMatch);
        } catch (IllegalArgumentException e) {
            log.warn("⚠️ Match update failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("❌ Error updating match {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update match.");
        }
    }
}
