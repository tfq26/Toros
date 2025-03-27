package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.request.UpdateMatchRequest;
import com.example.pickleballtournament.service.LiveTournamentService;
import com.example.pickleballtournament.service.MatchService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/match")
@CrossOrigin(origins = "http://localhost:5173")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    /** 🎯 Get Match by ID */
    @GetMapping("/{matchId}")
    public ResponseEntity<?> getMatchById(@PathVariable String matchId) {
        try {
            Optional<Match> matchOpt = matchService.getMatchById(matchId);
            if (matchOpt.isPresent()) {
                log.info("✅ Found match: {}", matchOpt.get().getId());
                return ResponseEntity.ok(matchOpt.get());
            } else {
                log.warn("⚠️ Match not found for ID: {}", matchId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Match not found.");
            }
        } catch (Exception e) {
            log.error("❌ Error fetching match {}: {}", matchId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch match.");
        }
    }

    /** 🎯 Get All Matches */
    @GetMapping
    public ResponseEntity<List<String>> getAllMatches() {
        List<String> matchIds = matchService.getAllMatches();
        if (matchIds.isEmpty()) {
            log.warn("⚠️ No matches found.");
            return ResponseEntity.ok(List.of());
        }
        matchIds.forEach(matchId -> log.info("📡 Match ID in response: {}", matchId));
        return ResponseEntity.ok(matchIds);
    }

    /** 🎯 Get Matches by Team ID */
    @GetMapping("/team/{teamId}")
    public ResponseEntity<?> getMatchesByTeam(@PathVariable String teamId) {
        try {
            List<String> matchIds = matchService.getMatchesByTeam(teamId);
            if (matchIds.isEmpty()) {
                log.warn("⚠️ No matches found for Team ID: {}", teamId);
                return ResponseEntity.ok(List.of());
            }
            return ResponseEntity.ok(matchIds);
        } catch (Exception e) {
            log.error("❌ Error fetching matches for Team ID {}: {}", teamId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch matches.");
        }
    }

    /** 🎯 Update Match */
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateMatch(@PathVariable String id, @RequestBody UpdateMatchRequest request) {
        try {
            log.info("📥 Received match update request: Match ID={}, Team1Score={}, Team2Score={}, Status={}",
                    id, request.getTeam1Score(), request.getTeam2Score(), request.getStatus());
            if (request == null) {
                log.error("❌ Received null request body!");
                return ResponseEntity.badRequest().body("Invalid JSON request.");
            }
            String updatedMatchId = matchService.updateMatch(id, request);
            log.info("✅ Match {} updated successfully.", id);
            return ResponseEntity.ok(updatedMatchId);
        } catch (IllegalArgumentException e) {
            log.warn("⚠️ Match update failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            log.error("❌ Error updating match {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update match.");
        }
    }

}
