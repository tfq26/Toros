package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.model.Tournament;
import com.example.pickleballtournament.request.TournamentSetupRequest;
import com.example.pickleballtournament.request.UpdateMatchRequest;
import com.example.pickleballtournament.service.TeamService;
import com.example.pickleballtournament.service.TournamentSetupService;
import com.example.pickleballtournament.service.LiveTournamentService;
import com.example.pickleballtournament.service.TournamentService; // ✅ Added missing import
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tournament")
public class TournamentController {

    private final TournamentSetupService tournamentSetupService;
    private final LiveTournamentService liveTournamentService;
    private final TournamentService tournamentService; // ✅ Added missing service
    private final TeamService teamService;

    private static final Logger logger = LoggerFactory.getLogger(TournamentController.class);

    public TournamentController(TournamentSetupService tournamentSetupService,
                                LiveTournamentService liveTournamentService,
                                TournamentService tournamentService, // ✅ Injected
                                TeamService teamService) {
        this.tournamentSetupService = tournamentSetupService;
        this.liveTournamentService = liveTournamentService;
        this.tournamentService = tournamentService;
        this.teamService = teamService;
    }

    /** ✅ Setup Tournament */
    @PostMapping("/setup")
    public ResponseEntity<?> setupTournament(@RequestBody TournamentSetupRequest request) {
        try {
            logger.info("Setting up tournament with request: {}", request);
            tournamentSetupService.setupTournament(
                    request.getNumCourts(),
                    request.getGamesPerTeam(),
                    request.isUseExistingPlayers(),
                    request.isTiered(),
                    request.getStartTime(),
                    request.getMatchDuration()
            );
            return ResponseEntity.ok(Collections.singletonMap("message", "Tournament setup successfully."));
        } catch (Exception e) {
            logger.error("Unexpected error during tournament setup: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to setup tournament."));
        }
    }

    /** ✅ Setup Teams */
    @PostMapping("/setup-teams")
    public ResponseEntity<?> setupTeams() {
        try {
            tournamentSetupService.setupAndGenerateTeams();
            return ResponseEntity.ok(Collections.singletonMap("message", "Teams set up successfully."));
        } catch (Exception e) {
            logger.error("Error setting up teams: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Error setting up teams."));
        }
    }

    /** ✅ Get Live Matches */
    @GetMapping("/live")
    public ResponseEntity<List<Match>> getAllMatches() {
        return ResponseEntity.ok(liveTournamentService.getAllMatches());
    }

    /** ✅ Update Match */
    @PatchMapping("/match/{id}")
    public ResponseEntity<?> updateMatch(@PathVariable String id, @RequestBody UpdateMatchRequest request) {
        try {
            liveTournamentService.updateMatchStatus(id, request.getTeam1Score(), request.getTeam2Score(), request.getStatus());
            return ResponseEntity.ok(Collections.singletonMap("message", "Match updated successfully."));
        } catch (Exception e) {
            logger.error("Error updating match: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to update match."));
        }
    }

    /** ✅ End Tournament */
    @PostMapping("/end")
    public ResponseEntity<?> endTournament() {
        try {
            liveTournamentService.endTournament();
            liveTournamentService.clearAllMatches();
            return ResponseEntity.ok(Collections.singletonMap("message", "Tournament ended and all matches cleared."));
        } catch (Exception e) {
            logger.error("Error ending tournament: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to end the tournament."));
        }
    }

    /** ✅ Get Standings */
    @GetMapping("/standings")
    public ResponseEntity<List<Team>> getTeamStandings() {
        return ResponseEntity.ok(liveTournamentService.getStandings());
    }

    /** ✅ Get Matches by Team ID */
    @GetMapping("/matches/team/{teamId}")
    public ResponseEntity<?> getMatchesByTeam(@PathVariable String teamId) {
        try {
            return ResponseEntity.ok(liveTournamentService.getMatchesByTeam(teamId));
        } catch (Exception e) {
            logger.error("Error fetching matches for team: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to fetch matches."));
        }
    }

    /** ✅ Get Matches by Team Name */
    @GetMapping("/matches/teamName/{teamName}")
    public ResponseEntity<?> getMatchesByTeamName(@PathVariable String teamName) {
        try {
            return ResponseEntity.ok(liveTournamentService.getMatchesByTeamName(teamName));
        } catch (Exception e) {
            logger.error("Error fetching matches for team name: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to fetch matches."));
        }
    }

    /** ✅ Get Active Tournament */
    @GetMapping("/active")
    public ResponseEntity<?> getActiveTournament() {
        try {
            Optional<Tournament> tournament = tournamentService.getActiveTournament();
            if (tournament.isPresent()) {
                return ResponseEntity.ok(tournament.get());
            } else {
                return ResponseEntity.ok(Collections.singletonMap("active", false));
            }
        } catch (Exception e) {
            logger.error("Error fetching active tournament: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to fetch active tournament."));
        }
    }

    /** ✅ Setup Knockout Matches */
    @PostMapping("/knockout/setup")
    public ResponseEntity<?> setupKnockout(@RequestParam int topTeams) {
        try {
            List<Team> eligibleTeams = teamService.getTopTeams(topTeams);
            tournamentSetupService.createKnockoutMatches(eligibleTeams);
            return ResponseEntity.ok(eligibleTeams);
        } catch (Exception e) {
            logger.error("Error setting up knockout: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to set up knockout."));
        }
    }

    /** ✅ Advance Winner in Knockout */
    @PostMapping("/knockout/advance")
    public ResponseEntity<?> advanceWinner(@RequestParam String matchId, @RequestParam String winnerTeamId) {
        try {
            liveTournamentService.advanceWinner(matchId, winnerTeamId);
            return ResponseEntity.ok(Collections.singletonMap("message", "Winner advanced successfully."));
        } catch (Exception e) {
            logger.error("Error advancing winner: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to advance winner."));
        }
    }
}
