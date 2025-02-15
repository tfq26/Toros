package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.service.LiveTournamentService;
import com.example.pickleballtournament.service.TeamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;
    private final LiveTournamentService tournamentService;

    public TeamController(TeamService teamService, LiveTournamentService tournamentService) {
        this.teamService = teamService;
        this.tournamentService = tournamentService;
    }

    /**
     * Reset all team standings.
     *
     * @return Success or error message
     */
    @DeleteMapping("/reset")
    public ResponseEntity<?> resetStandings() {
        try {
            teamService.clearStandings();
            return ResponseEntity.ok(Collections.singletonMap("message", "Standings reset successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to reset standings."));
        }
    }

    /**
     * Retrieve all valid team standings.
     *
     * @return List of valid teams
     */
    @GetMapping("/standings")
    public ResponseEntity<List<Team>> getTeamStandings() {
        try {
            // Use the existing getStandings method in tournamentService
            List<Team> validTeams = tournamentService.getStandings();
            return ResponseEntity.ok(validTeams);
        } catch (Exception e) {
            // Log the exception for debugging purposes
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }
}
