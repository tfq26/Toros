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

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/tournament")
public class TournamentController {

    private final TournamentSetupService tournamentSetupService;
    private final LiveTournamentService liveTournamentService;

    public TournamentController(TournamentSetupService tournamentSetupService, LiveTournamentService liveTournamentService) {
        this.tournamentSetupService = tournamentSetupService;
        this.liveTournamentService = liveTournamentService;
    }

    /** ✅ Setup Tournament */
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
            log.error("❌ Error setting up tournament", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to setup tournament.");
        }
    }

    /** ✅ Get Active Tournament */
    @GetMapping("/active")
    public ResponseEntity<?> getActiveTournament() {
        Optional<Tournament> tournament = liveTournamentService.getActiveTournament();

        if (tournament.isPresent()) {
            return ResponseEntity.ok(tournament.get());
        } else {
            log.warn("⚠️ No active tournament found.");
            return ResponseEntity.ok(Collections.singletonMap("message", "No active tournament."));
        }
    }


    @PostMapping("/end")
    public ResponseEntity<String> endTournament() {
        liveTournamentService.endTournament();
        log.info("Live tournament has been ended.");
        return ResponseEntity.ok("Tournament ended successfully.");
    }

    /** ✅ Get All Tournaments */
    @GetMapping("/all")
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        List<Tournament> tournaments = liveTournamentService.getAllTournaments();
        if (tournaments.isEmpty()) {
            log.info("📂 No tournaments found.");
        }
        return ResponseEntity.ok(tournaments);
    }

    /** ✅ Get Standings */
    @GetMapping("/standings")
    public ResponseEntity<List<Team>> getTeamStandings() {
        List<Team> standings = liveTournamentService.getStandings();
        return ResponseEntity.ok(standings);
    }

    /** ✅ Get All Matches */
    @GetMapping("/matches")
    public ResponseEntity<List<Match>> getAllMatches() {
        List<Match> matches = liveTournamentService.getAllMatches();
        return ResponseEntity.ok(matches.isEmpty() ? Collections.emptyList() : matches);
    }

    /** ✅ Get Matches by Team ID */
    @GetMapping("/matches/team/{teamId}")
    public ResponseEntity<?> getMatchesByTeam(@PathVariable String teamId) {
        try {
            List<Match> matches = liveTournamentService.getMatchesByTeam(teamId);
            return ResponseEntity.ok(matches.isEmpty() ? Collections.emptyList() : matches);
        } catch (Exception e) {
            log.error("❌ Error fetching matches for team ID: {}", teamId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to fetch matches."));
        }
    }

    /** ✅ Update Match */
    @PatchMapping("/match/{id}")
    public ResponseEntity<String> updateMatch(@PathVariable String id, @RequestBody UpdateMatchRequest request) {
        try {
            log.info("🔄 Updating match {} - Status: {}", id, request.getStatus());
            liveTournamentService.updateMatchStatus(id, request.getTeam1Score(), request.getTeam2Score(), request.getStatus());
            log.info("✅ Match {} updated successfully.", id);
            return ResponseEntity.ok("Match updated successfully.");
        } catch (Exception e) {
            log.error("❌ Error updating match {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update match.");
        }
    }
}
