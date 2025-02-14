package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.model.Tournament;
import com.example.pickleballtournament.request.TournamentSetupRequest;
import com.example.pickleballtournament.request.UpdateMatchRequest;
import com.example.pickleballtournament.service.LiveTournamentService;
import com.example.pickleballtournament.service.TournamentSetupService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    /** ✅ Setup a New Tournament */
    @PostMapping("/setup")
    public ResponseEntity<?> setupTournament(@RequestBody TournamentSetupRequest request) {
        try {
            log.info("Received tournament setup request: {}", request);

            Tournament tournament = tournamentSetupService.setupTournament(
                    request.getNumCourts(),
                    request.getGamesPerTeam(),
                    request.isUseExistingPlayers(),
                    request.isTiered(),
                    request.getStartTime(),
                    request.getMatchDuration(),
                    request.getTournamentName()
            );

            return ResponseEntity.ok(tournament);
        } catch (Exception e) {
            log.error("Error setting up tournament", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to setup tournament.");
        }
    }

    /** ✅ Get Active Tournament */
    @GetMapping("/active")
    public ResponseEntity<?> getActiveTournament() {
        Optional<Tournament> tournament = liveTournamentService.getActiveTournament();
        return tournament.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok("No active tournament found."));
    }

    /** ✅ End Tournament */
    @PostMapping("/end")
    public ResponseEntity<String> endTournament() {
        try {
            liveTournamentService.endTournament();
            return ResponseEntity.ok("Tournament successfully ended.");
        } catch (Exception e) {
            log.error("Error ending tournament", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to end tournament.");
        }
    }

    /** ✅ Get All Tournaments */
    @GetMapping("/all")
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        List<Tournament> tournaments = liveTournamentService.getAllTournaments();
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
        return ResponseEntity.ok(liveTournamentService.getAllMatches());
    }

    /** ✅ Get Matches by Team ID */
    @GetMapping("/matches/team/{teamId}")
    public ResponseEntity<List<Match>> getMatchesByTeam(@PathVariable String teamId) {
        try {
            return ResponseEntity.ok(liveTournamentService.getMatchesByTeam(teamId));
        } catch (Exception e) {
            log.error("Error fetching matches for team ID: {}", teamId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /** ✅ Update Match */
    @PatchMapping("/match/{id}")
    public ResponseEntity<String> updateMatch(@PathVariable String id, @RequestBody UpdateMatchRequest request) {
        try {
            liveTournamentService.updateMatchStatus(id, request.getTeam1Score(), request.getTeam2Score(), request.getStatus());
            return ResponseEntity.ok("Match updated successfully.");
        } catch (Exception e) {
            log.error("Error updating match {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update match.");
        }
    }
}
