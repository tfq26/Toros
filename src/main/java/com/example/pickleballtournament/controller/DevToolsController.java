package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Player;
import com.example.pickleballtournament.repository.PlayerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/devtools")
@CrossOrigin(origins = "http://localhost:5173")
public class DevToolsController {

    private final PlayerRepository playerRepository;

    public DevToolsController(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
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
}
