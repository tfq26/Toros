package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.request.TournamentSetupRequest;
import com.example.pickleballtournament.request.UpdateMatchRequest;
import com.example.pickleballtournament.service.TeamService;
import com.example.pickleballtournament.service.TournamentSetupService;
import com.example.pickleballtournament.service.LiveTournamentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/tournament")
public class TournamentController {

    private final TournamentSetupService tournamentSetupService;
    private final LiveTournamentService liveTournamentService;
    private final TeamService teamService;
    private static final Logger logger = LoggerFactory.getLogger(TournamentController.class);

    public TournamentController(TournamentSetupService tournamentSetupService, LiveTournamentService liveTournamentService, TeamService teamService) {
        this.tournamentSetupService = tournamentSetupService;
        this.liveTournamentService = liveTournamentService;
        this.teamService = teamService;
    }

    /** ✅ Setup Tournament */
    @PostMapping("/setup")
    public ResponseEntity<String> setupTournament(@RequestBody TournamentSetupRequest request) {
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
            return ResponseEntity.ok("Tournament setup successfully.");
        } catch (Exception e) {
            logger.error("Unexpected error during tournament setup", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to setup tournament.");
        }
    }

    /** ✅ Setup Teams */
    @PostMapping("/setup-teams")
    public ResponseEntity<String> setupTeams() {
        try {
            tournamentSetupService.setupAndGenerateTeams();
            return ResponseEntity.ok("Teams have been successfully set up.");
        } catch (Exception e) {
            logger.error("Error setting up teams", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error setting up teams.");
        }
    }

    /** ✅ Get All Matches */
    @GetMapping("/live")
    public ResponseEntity<List<Match>> getAllMatches() {
        return ResponseEntity.ok(liveTournamentService.getAllMatches());
    }

    /** ✅ Update Match */
    @PatchMapping("/match/{id}")
    public ResponseEntity<String> updateMatch(@PathVariable String id, @RequestBody UpdateMatchRequest request) {
        try {
            liveTournamentService.updateMatchStatus(id, request.getTeam1Score(), request.getTeam2Score(), request.getStatus());
            return ResponseEntity.ok("Match updated successfully.");
        } catch (Exception e) {
            logger.error("Unexpected error updating match", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update match.");
        }
    }

    /** ✅ End Tournament */
    @PostMapping("/end")
    public ResponseEntity<String> endTournament() {
        try {
            liveTournamentService.endTournament();
            liveTournamentService.clearAllMatches();
            return ResponseEntity.ok("Tournament ended and all matches cleared successfully.");
        } catch (Exception e) {
            logger.error("Error ending tournament", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to end the tournament.");
        }
    }

    /** ✅ Get Standings */
    @GetMapping("/standings")
    public ResponseEntity<List<Team>> getTeamStandings() {
        return ResponseEntity.ok(liveTournamentService.getStandings());
    }

    /** ✅ Get Matches by Team ID */
    @GetMapping("/matches/team/{teamId}")
    public ResponseEntity<List<Match>> getMatchesByTeam(@PathVariable String teamId) {
        try {
            return ResponseEntity.ok(liveTournamentService.getMatchesByTeam(teamId));
        } catch (Exception e) {
            logger.error("Unexpected error fetching matches for team", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /** ✅ Get Matches by Team Name */
    @GetMapping("/matches/teamName/{teamName}")
    public ResponseEntity<List<Match>> getMatchesByTeamName(@PathVariable String teamName) {
        try {
            return ResponseEntity.ok(liveTournamentService.getMatchesByTeamName(teamName));
        } catch (Exception e) {
            logger.error("Unexpected error fetching matches for team name", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /** ✅ Setup Knockout Matches */
    @PostMapping("/knockout/setup")
    public ResponseEntity<List<Team>> setupKnockout(@RequestParam int topTeams) {
        try {
            List<Team> eligibleTeams = teamService.getTopTeams(topTeams);
            tournamentSetupService.createKnockoutMatches(eligibleTeams);
            return ResponseEntity.ok(eligibleTeams);
        } catch (Exception e) {
            logger.error("Unexpected error setting up knockout", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /** ✅ Advance Winner in Knockout */
    @PostMapping("/knockout/advance")
    public ResponseEntity<String> advanceWinner(@RequestParam String matchId, @RequestParam String winnerTeamId) {
        try {
            liveTournamentService.advanceWinner(matchId, winnerTeamId);
            return ResponseEntity.ok("Winner advanced successfully.");
        } catch (Exception e) {
            logger.error("Error advancing winner", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to advance winner.");
        }
    }
}
