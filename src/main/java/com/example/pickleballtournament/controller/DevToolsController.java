package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Player;
import com.example.pickleballtournament.model.Tournament;
import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.model.User;
import com.example.pickleballtournament.repository.PlayerRepository;
import com.example.pickleballtournament.repository.TournamentRepository;
import com.example.pickleballtournament.repository.MatchRepository;
import com.example.pickleballtournament.repository.TeamRepository;
import com.example.pickleballtournament.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/devtools")
@CrossOrigin(origins = "http://localhost:5173")
public class DevToolsController {

    private final PlayerRepository playerRepository;
    private final TournamentRepository tournamentRepository;
    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    public DevToolsController(PlayerRepository playerRepository, TournamentRepository tournamentRepository,
                              MatchRepository matchRepository, TeamRepository teamRepository, UserRepository userRepository) {
        this.playerRepository = playerRepository;
        this.tournamentRepository = tournamentRepository;
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    // Get all players
    @GetMapping("/players")
    public List<Player> getAllPlayers() {
        log.info("Fetching all players");
        return playerRepository.findAll();
    }

    // Get players by team number
    @GetMapping("/players/team/{teamNumber}")
    public List<Player> getPlayersByTeam(@PathVariable int teamNumber) {
        log.info("Fetching players for team number {}", teamNumber);
        return playerRepository.findByTeamNumber(teamNumber);
    }

    // Get players by status (for example, status "registered")
    @GetMapping("/players/status/{status}")
    public List<Player> getPlayersByStatus(@PathVariable String status) {
        log.info("Fetching players with status {}", status);
        return playerRepository.findByStatus(status);
    }

    // "Delete" all active tournaments by marking them as inactive
    @DeleteMapping("/tournaments/active")
    public List<Tournament> deleteAllActiveTournaments() {
        log.info("Marking all active tournaments as inactive");
        List<Tournament> activeTournaments = tournamentRepository.findByIsActiveTrue();
        activeTournaments.forEach(tournament -> tournament.setActive(false));
        return tournamentRepository.saveAll(activeTournaments);
    }

    // Delete all players
    @DeleteMapping("/players")
    public ResponseEntity<String> deleteAllPlayers() {
        log.info("Deleting all players");
        playerRepository.deleteAll();
        return ResponseEntity.ok("All players deleted successfully.");
    }

    // Delete all matches
    @DeleteMapping("/matches")
    public ResponseEntity<String> deleteAllMatches() {
        log.info("Deleting all matches");
        matchRepository.deleteAll();
        return ResponseEntity.ok("All matches deleted successfully.");
    }

    // Delete all teams
    @DeleteMapping("/teams")
    public ResponseEntity<String> deleteAllTeams() {
        log.info("Deleting all teams");
        teamRepository.deleteAll();
        return ResponseEntity.ok("All teams deleted successfully.");
    }

    // Delete all users
    @DeleteMapping("/users")
    public ResponseEntity<String> deleteAllUsers() {
        log.info("Deleting all users");
        userRepository.deleteAll();
        return ResponseEntity.ok("All users deleted successfully.");
    }
}
