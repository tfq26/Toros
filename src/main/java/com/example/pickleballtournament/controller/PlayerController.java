package com.example.pickleballtournament.controller;
import com.example.pickleballtournament.model.Player;
import com.example.pickleballtournament.service.PlayerService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @PostMapping("/import")
    public List<Player> importPlayers(@RequestParam("file") MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        return playerService.importPlayersFromExcel(file.getInputStream());
    }

    @GetMapping("/all")
    public List<Player> getAllPlayers() {
        return playerService.getAllPlayers();
    }

    @GetMapping("/team/{teamNumber}")
    public List<Player> getPlayersByTeam(@PathVariable int teamNumber) {
        return playerService.getPlayersByTeamNumber(teamNumber);
    }

    @GetMapping
    public String welcome() {
        return "Welcome to the Pickleball Player Management System! Upload your Excel file at /import.";
    }
}

