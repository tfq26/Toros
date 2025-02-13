package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Player;
import com.example.pickleballtournament.service.PlayerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from React frontend
public class PlayerController {

    private final Logger logger = LoggerFactory.getLogger(PlayerController.class);
    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    /**
     * Import players from an Excel file and save them to the database.
     */
    @PostMapping("/import")
    public ResponseEntity<String> importPlayers(@RequestBody List<Player> players) {
        if (players == null || players.isEmpty()) {
            logger.warn("Received empty player list.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No players found in the request.");
        }

        try {
            playerService.savePlayers(players);
            logger.info("Successfully imported {} players.", players.size());
            return ResponseEntity.ok("Players imported successfully! Number of players: " + players.size());
        } catch (Exception e) {
            logger.error("Unexpected error during import: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while importing players: " + e.getMessage());
        }
    }

    /**
     * Get all players in the database.
     */
    @GetMapping("/all") // Maps to GET /api/players/all
    public ResponseEntity<List<Player>> getAllPlayers() {
        List<Player> players = playerService.getAllPlayers();
        logger.info("Fetched {} players from the database.", players.size());
        return ResponseEntity.ok(players);
    }

    /**
     * Get players by their team number.
     */
    @GetMapping("/team/{teamNumber}")
    public ResponseEntity<List<Player>> getPlayersByTeam(@PathVariable int teamNumber) {
        List<Player> players = playerService.getPlayersByTeamNumber(teamNumber);
        logger.info("Fetched {} players for team number {}.", players.size(), teamNumber);
        return ResponseEntity.ok(players);
    }

    /**
     * Get all distinct team numbers.
     */
    @GetMapping("/teamNumbers")
    public ResponseEntity<List<Integer>> getTeamNumbers() {
        List<Integer> teamNumbers = playerService.getAllTeamNumbers();
        logger.info("Fetched {} team numbers from the database.", teamNumbers.size());
        return ResponseEntity.ok(teamNumbers);
    }

    /**
     * Welcome endpoint for quick testing.
     */
    @GetMapping("/welcome")
    public ResponseEntity<String> welcome() {
        logger.info("Welcome endpoint accessed.");
        return ResponseEntity.ok("Welcome to the Pickleball Player Management System! Upload your Excel file at /import.");
    }
}
