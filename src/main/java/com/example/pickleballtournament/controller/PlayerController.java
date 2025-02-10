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
            logger.warn("File upload failed: empty file");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("The uploaded file is empty. Please upload a valid Excel file.");
        }

        // Validate file type (optional but recommended)
        if (!file.getOriginalFilename().endsWith(".xlsx") && !file.getOriginalFilename().endsWith(".xls")) {
            logger.warn("Invalid file type: {}", file.getOriginalFilename());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid file type. Please upload an Excel file (.xlsx or .xls).");
        }

        try (InputStream inputStream = file.getInputStream()) {
            // Import players and save directly to the database
            List<Player> players = playerService.importPlayersFromExcel(inputStream);
            playerService.savePlayers(players);
            logger.info("Successfully imported {} players.", players.size());
            return ResponseEntity.ok("Players imported and saved successfully! Number of players: " + players.size());
        } catch (IllegalArgumentException e) {
            logger.error("Validation error during import: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Validation Error: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during import: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
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
