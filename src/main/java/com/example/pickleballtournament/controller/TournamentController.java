package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.repository.MatchRepository;
import com.example.pickleballtournament.request.TournamentSetupRequest;
import com.example.pickleballtournament.request.UpdateMatchRequest;
import com.example.pickleballtournament.service.TeamService;
import com.example.pickleballtournament.service.TournamentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/tournament")
public class TournamentController {

    private final TournamentService tournamentService;
    private static final Logger logger = LoggerFactory.getLogger(TournamentController.class);
    private final MatchRepository matchRepository;
    private final TeamService teamService;

    public TournamentController(TournamentService tournamentService, MatchRepository matchRepository, TeamService teamService) {
        this.tournamentService = tournamentService;
        this.matchRepository = matchRepository;
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
                    request.getStartTime(), // Pass the converted LocalTime
                    request.getMatchDuration()
            );

            logger.info("Tournament setup completed successfully.");
            return ResponseEntity.ok("Tournament setup successfully.");
        } catch (IllegalArgumentException e) {
            logger.error("Setup failed due to invalid input: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during tournament setup: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to setup tournament.");
        }
    }

    @PostMapping("/setup-teams")
    public ResponseEntity<String> setupTeams() {
        try {
            tournamentService.setupAndGenerateTeams();
            return ResponseEntity.ok("Teams have been successfully set up.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error setting up teams: " + e.getMessage());
        }
    }

    @GetMapping("/live")
    public ResponseEntity<List<Match>> getLiveMatches() {
        try {
            logger.info("Fetching live matches...");
            List<Match> liveMatches = tournamentService.getAllMatches();

            if (liveMatches.isEmpty()) {
                logger.warn("No live matches found.");
                return ResponseEntity.ok(Collections.emptyList()); // Return empty list instead of 204
            }

            logger.info("Found {} live matches.", liveMatches.size());
            return ResponseEntity.ok(liveMatches);
        } catch (Exception e) {
            logger.error("Error fetching live matches: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Match>> getAllMatches() {
        try {
            logger.info("Fetching all matches...");
            List<Match> allMatches = tournamentService.getAllMatches();

            if (allMatches.isEmpty()) {
                logger.warn("No matches found.");
                return ResponseEntity.ok(Collections.emptyList());
            }

            logger.info("Found {} matches.", allMatches.size());
            return ResponseEntity.ok(allMatches);
        } catch (Exception e) {
            logger.error("Error fetching all matches: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @PatchMapping("/live/{id}")
    public ResponseEntity<String> updateMatch(
            @PathVariable String id,
            @RequestBody UpdateMatchRequest request
    ) {
        try {
            logger.info("Updating match with ID: {}", id);

            // Validate request
            if (request.getTeam1Score() < 0 || request.getTeam2Score() < 0) {
                logger.error("Invalid scores provided for match update: {}", request);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Scores must be non-negative.");
            }

            tournamentService.updateMatchStatus(id, request.getTeam1Score(), request.getTeam2Score(), request.getStatus());
            logger.info("Match updated successfully.");
            return ResponseEntity.ok("Match updated successfully.");
        } catch (IllegalArgumentException e) {
            logger.error("Match update failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during match update: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update match.");
        }
    }

    @PostMapping("/live/end")
    public ResponseEntity<String> endTournament() {
        try {
            logger.info("Ending tournament...");

            // Call the service to end the tournament
            tournamentService.endTournament();

            // Call the service to clear all matches
            tournamentService.clearAllMatches();

            logger.info("Tournament ended and all matches cleared successfully.");
            return ResponseEntity.ok("Tournament ended and all matches cleared successfully.");
        } catch (Exception e) {
            logger.error("Error ending tournament: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to end the tournament: " + e.getMessage());
        }
    }

    @GetMapping("/standings")
    public ResponseEntity<List<Team>> getTeamStandings() {
        try {
            logger.info("Fetching team standings...");
            List<Team> standings = tournamentService.getStandings();

            if (standings.isEmpty()) {
                logger.warn("No standings found.");
                return ResponseEntity.ok(Collections.emptyList());
            }

            logger.info("Found standings for {} teams.", standings.size());
            return ResponseEntity.ok(standings);
        } catch (Exception e) {
            logger.error("Error fetching standings: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/teamMatches/{teamId}")
    public ResponseEntity<?> getMatchesByTeam(@PathVariable String teamId) {
        logger.info("Fetching matches for team ID: {}", teamId);
        try {
            List<Match> matches = tournamentService.getMatchesByTeam(teamId);

            if (matches.isEmpty()) {
                logger.warn("No matches found for team ID: {}", teamId);
                return ResponseEntity.ok(Collections.emptyList());
            }

            logger.info("Found {} matches for team ID: {}", matches.size(), teamId);
            return ResponseEntity.ok(matches);
        } catch (IllegalArgumentException e) {
            logger.error("Error fetching matches for team: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error fetching matches for team: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Failed to fetch matches for the team."));
        }
    }

    @GetMapping("/test/matches")
    public ResponseEntity<?> testFindMatchesByTeamId() {
        String teamId = "678b3872268c052481a9d6f3"; // Replace with your specific team ID
        try {
            logger.info("Testing find matches for team ID: {}", teamId);
            List<Match> matches = matchRepository.findByTeamId(teamId);

            if (matches.isEmpty()) {
                logger.warn("No matches found for team ID: {}", teamId);
                return ResponseEntity.ok("No matches found for the provided team ID.");
            }

            logger.info("Found {} matches for team ID: {}", matches.size(), teamId);
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            logger.error("Error during test find matches for team ID: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/teamMatchesByName/{teamName}")
    public ResponseEntity<?> getMatchesByTeamName(@PathVariable String teamName) {
        logger.info("Fetching matches for team name: {}", teamName);
        try {
            List<Match> matches = tournamentService.getMatchesByTeamName(teamName);

            if (matches.isEmpty()) {
                logger.warn("No matches found for team name: {}", teamName);
                return ResponseEntity.ok(Collections.emptyList());
            }

            logger.info("Found {} matches for team name: {}", matches.size(), teamName);
            return ResponseEntity.ok(matches);
        } catch (IllegalArgumentException e) {
            logger.error("Error fetching matches for team name: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error fetching matches for team name: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Failed to fetch matches for the team."));
        }
    }

    /**
     * Endpoint to set up the knockout stage
     * @param topTeams Number of top teams to qualify
     * @return List of qualified teams
     */
    @PostMapping("/knockout/setup")
    public ResponseEntity<List<Team>> setupKnockout(@RequestParam int topTeams) {
        try {
            logger.info("Setting up knockout with top {} teams.", topTeams);

            // Fetch teams sorted by criteria (e.g., wins)
            List<Team> eligibleTeams = teamService.getTopTeams(topTeams);

            // Initialize knockout matches
            tournamentService.createKnockoutMatches(eligibleTeams);

            logger.info("Knockout setup complete with {} teams.", eligibleTeams.size());
            return ResponseEntity.ok(eligibleTeams);
        } catch (IllegalArgumentException e) {
            logger.error("Error setting up knockout: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            logger.error("Unexpected error setting up knockout: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/advanceWinner")
    public ResponseEntity<String> advanceWinner(@RequestParam String matchId, @RequestParam String winnerTeamId) {
        try {
            tournamentService.advanceWinner(matchId, winnerTeamId);
            return ResponseEntity.ok("Winner advanced successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

}
