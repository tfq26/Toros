package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dev")
@CrossOrigin(origins = "http://localhost:5173") // ✅ Allow frontend requests
public class DevToolsController {

    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;

    public DevToolsController(PlayerRepository playerRepository, MatchRepository matchRepository,
                              TeamRepository teamRepository, TournamentRepository tournamentRepository) {
        this.playerRepository = playerRepository;
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.tournamentRepository = tournamentRepository;
    }

    /** ✅ Delete All Data from a Specific Collection */
    @DeleteMapping("/delete/{collection}")
    public ResponseEntity<Map<String, String>> deleteCollection(@PathVariable String collection) {
        switch (collection.toLowerCase()) {
            case "players":
                playerRepository.deleteAll();
                break;
            case "matches":
                matchRepository.deleteAll();
                break;
            case "teams":
                teamRepository.deleteAll();
                break;
            case "tournaments":
                tournamentRepository.deleteAll();
                break;
            default:
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid collection name."));
        }
        return ResponseEntity.ok(Map.of("message", collection + " data deleted successfully."));
    }

    /** ✅ Delete All Data from All Collections */
    @DeleteMapping("/deleteAll")
    public ResponseEntity<Map<String, String>> deleteAllData() {
        playerRepository.deleteAll();
        matchRepository.deleteAll();
        teamRepository.deleteAll();
        tournamentRepository.deleteAll();
        return ResponseEntity.ok(Map.of("message", "All data deleted successfully."));
    }
}
