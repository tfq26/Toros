package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Player;
import com.example.pickleballtournament.service.PlayerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @PostMapping("/import")
    public ResponseEntity<String> importPlayers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The uploaded file is empty. Please upload a valid Excel file.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            // Import players and save directly to the MongoDB cluster
            List<Player> players = playerService.importPlayersFromExcel(inputStream);
            playerService.savePlayers(players);
            return ResponseEntity.ok("Players imported and saved to MongoDB successfully! Number of players: " + players.size());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Validation Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public List<Player> getAllPlayers() {
        return playerService.getAllPlayers();
    }

    @GetMapping("/team/{teamNumber}")
    public List<Player> getPlayersByTeam(@PathVariable int teamNumber) {
        return playerService.getPlayersByTeamNumber(teamNumber);
    }

    @GetMapping("/teamNumbers")
    public List<Integer> getTeamNumbers() {
        return playerService.getAllTeamNumbers();
    }

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to the Pickleball Player Management System! Upload your Excel file at /import.";
    }
}
