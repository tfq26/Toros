package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.request.TournamentSetupRequest;
import com.example.pickleballtournament.request.UpdateMatchRequest;
import com.example.pickleballtournament.service.TeamService;
import com.example.pickleballtournament.service.TournamentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/tournament")
public class TournamentController {

    private final TournamentService tournamentService;
    private final TeamService teamService;
    private static final Logger logger = LoggerFactory.getLogger(TournamentController.class);

    public TournamentController(TournamentService tournamentService, TeamService teamService) {
        this.tournamentService = tournamentService;
        this.teamService = teamService;
    }

    @PostMapping("/setup")
    public ResponseEntity<String> setupTournament(@RequestBody TournamentSetupRequest request) {
        try {
            logger.info("Setting up tournament with request: {}", request);

            tournamentService.setupTournament(
                    request.getNumCourts(),
                    request.getGamesPerTeam(),
                    request.isUseExistingPlayers(),
                    request.isTiered(),
                    request.getStartTime(),
                    request.getMatchDuration()
            );

            logger.info("Tournament setup completed successfully.");
            return ResponseEntity.ok("Tournament setup successfully.");
        } catch (IllegalArgumentException e) {
            logger.error("Setup failed due to invalid input: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during tournament setup", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to setup tournament.");
        }
    }

    @PostMapping("/setup-teams")
    public ResponseEntity<String> setupTeams() {
        try {
            tournamentService.setupAndGenerateTeams();
            return ResponseEntity.ok("Teams have been successfully set up.");
        } catch (Exception e) {
            logger.error("Error setting up teams", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error setting up teams: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Match>> getAllMatches() {
        List<Match> matches = tournamentService.getAllMatches();
        return ResponseEntity.ok(matches.isEmpty() ? Collections.emptyList() : matches);
    }

    @PatchMapping("/match/{id}")
    public ResponseEntity<String> updateMatch(@PathVariable String id, @RequestBody UpdateMatchRequest request) {
        try {
            if (request.getTeam1Score() < 0 || request.getTeam2Score() < 0) {
                return ResponseEntity.badRequest().body("Scores must be non-negative.");
            }

            tournamentService.updateMatchStatus(id, request.getTeam1Score(), request.getTeam2Score(), request.getStatus());
            return ResponseEntity.ok("Match updated successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error updating match", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update match.");
        }
    }

    @PostMapping("/end")
    public ResponseEntity<String> endTournament() {
        try {
            tournamentService.endTournament();
            tournamentService.clearAllMatches();
            return ResponseEntity.ok("Tournament ended and all matches cleared successfully.");
        } catch (Exception e) {
            logger.error("Error ending tournament", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to end the tournament.");
        }
    }

    @GetMapping("/standings")
    public ResponseEntity<List<Team>> getTeamStandings() {
        List<Team> standings = tournamentService.getStandings();
        return ResponseEntity.ok(standings.isEmpty() ? Collections.emptyList() : standings);
    }

    @GetMapping("/matches/team/{teamId}")
    public ResponseEntity<List<Match>> getMatchesByTeam(@PathVariable String teamId) {
        try {
            List<Match> matches = tournamentService.getMatchesByTeam(teamId);
            return ResponseEntity.ok(matches.isEmpty() ? Collections.emptyList() : matches);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        } catch (Exception e) {
            logger.error("Unexpected error fetching matches for team", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @GetMapping("/matches/teamName/{teamName}")
    public ResponseEntity<List<Match>> getMatchesByTeamName(@PathVariable String teamName) {
        try {
            List<Match> matches = tournamentService.getMatchesByTeamName(teamName);
            return ResponseEntity.ok(matches.isEmpty() ? Collections.emptyList() : matches);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        } catch (Exception e) {
            logger.error("Unexpected error fetching matches for team name", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @PostMapping("/knockout/setup")
    public ResponseEntity<List<Team>> setupKnockout(@RequestParam int topTeams) {
        try {
            List<Team> eligibleTeams = teamService.getTopTeams(topTeams);
            tournamentService.createKnockoutMatches(eligibleTeams);
            return ResponseEntity.ok(eligibleTeams);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        } catch (Exception e) {
            logger.error("Unexpected error setting up knockout", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @PostMapping("/knockout/advance")
    public ResponseEntity<String> advanceWinner(@RequestParam String matchId, @RequestParam String winnerTeamId) {
        try {
            tournamentService.advanceWinner(matchId, winnerTeamId);
            return ResponseEntity.ok("Winner advanced successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}
