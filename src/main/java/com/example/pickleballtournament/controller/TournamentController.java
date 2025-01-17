package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.request.TournamentSetupRequest;
import com.example.pickleballtournament.service.TournamentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournament")
public class TournamentController {

    private final TournamentService tournamentService;

    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

    @PostMapping("/setup")
    public ResponseEntity<String> setupTournament(@RequestBody TournamentSetupRequest request) {
        try {
            tournamentService.setupTournament(
                    request.getNumCourts(),
                    request.getGamesPerTeam(),
                    request.isUseExistingPlayers(),
                    request.isTiered()
            );
            return ResponseEntity.ok("Tournament setup successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to setup tournament.");
        }
    }

    @GetMapping("/live")
    public ResponseEntity<List<Match>> getLiveMatches() {
        try {
            List<Match> liveMatches = tournamentService.getLiveMatches();
            return ResponseEntity.ok(liveMatches);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PatchMapping("/live/{id}")
    public ResponseEntity<String> updateMatch(
            @PathVariable String id,
            @RequestParam int team1Score,
            @RequestParam int team2Score,
            @RequestParam String status
    ) {
        try {
            tournamentService.updateMatch(id, team1Score, team2Score, status);
            return ResponseEntity.ok("Match updated successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update match.");
        }
    }
}
