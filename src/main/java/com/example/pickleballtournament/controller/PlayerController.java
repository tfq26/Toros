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
    public ResponseEntity<String> importPlayers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            logger.warn("Received empty file.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file provided.");
        }

        logger.info("🔍 Received file: " + file.getOriginalFilename());

        try {
            // Convert MultipartFile to InputStream and import players
            InputStream inputStream = file.getInputStream();
            List<Player> players = playerService.importPlayersFromExcel(inputStream);

            // Save players to the database
            playerService.savePlayers(players);

            logger.info("✅ Successfully imported {} players.", players.size());
            return ResponseEntity.ok("Players imported successfully! Number of players: " + players.size());
        } catch (Exception e) {
            logger.error("❌ Error processing file:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while importing players: " + e.getMessage());
        }
    }

    /**
     * Get all players in the database.
     */
    @GetMapping("/all")
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
     * Get a player by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable String id) {
        Player player = playerService.getPlayerById(id);
        if (player == null) {
            logger.warn("Player with id {} not found.", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(player);
    }

    /**
     * Create a new player.
     */
    @PostMapping
    public ResponseEntity<Player> createPlayer(@RequestBody Player player) {
        try {
            Player createdPlayer = playerService.createPlayer(player);
            logger.info("Created new player with id {}.", createdPlayer.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPlayer);
        } catch (Exception e) {
            logger.error("Error creating player:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update an existing player.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable String id, @RequestBody Player updatedPlayer) {
        try {
            Player player = playerService.updatePlayer(id, updatedPlayer);
            logger.info("Updated player with id {}.", id);
            return ResponseEntity.ok(player);
        } catch (Exception e) {
            logger.error("Error updating player:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete a player.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable String id) {
        try {
            playerService.deletePlayer(id);
            logger.info("Deleted player with id {}.", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting player:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
