package com.example.Toros.controller;

import com.example.Toros.model.Team;
import com.example.Toros.service.TournamentService;
import com.example.Toros.service.TeamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;
    private final TournamentService tournamentService;

    public TeamController(TeamService teamService, TournamentService tournamentService) {
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

    /** 🎯 Get Team Standings */
    @GetMapping("/standings")
    public ResponseEntity<List<String>> getTeamStandings() {
        List<String> standings = tournamentService.getStandings();
        return ResponseEntity.ok(standings);
    }

    /**
     * Get teams by skill level.
     *
     * @param skillLevel the skill level criteria as an integer.
     * @return a list of teams that match the specified skill level.
     */
    @GetMapping("/skill/{skillLevel}")
    public ResponseEntity<?> getTeamsBySkillLevel(@PathVariable int skillLevel) {
        try {
            List<Team> teams = teamService.getTeamsBySkillLevel(skillLevel);
            return ResponseEntity.ok(teams);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to get teams by skill level: " + skillLevel));
        }
    }

    /**
     * Get teams by tournament ID.
     *
     * @param tournamentId the tournament identifier as a string.
     * @return a list of teams associated with the specified tournament.
     */
    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<?> getTeamsByTournamentId(@PathVariable String tournamentId) {
        try {
            List<Team> teams = teamService.getTeamsByTournamentId(tournamentId);
            return ResponseEntity.ok(teams);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to get teams for tournament ID: " + tournamentId));
        }
    }

    /**
     * Get all teams.
     *
     * @return a list of all teams
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllTeams() {
        try {
            List<Team> teams = teamService.getAllTeams();
            return ResponseEntity.ok(teams);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to get teams."));
        }
    }
}
