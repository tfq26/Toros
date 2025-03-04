package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Tournament;
import com.example.pickleballtournament.request.TournamentSetupRequest;
import com.example.pickleballtournament.request.UpdateMatchRequest;
import com.example.pickleballtournament.service.TournamentSetupService;
import com.example.pickleballtournament.service.LiveTournamentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/tournament")
@CrossOrigin(origins = "http://localhost:5173") // ✅ Allow frontend requests
public class TournamentController {

    private final TournamentSetupService tournamentSetupService;
    private final LiveTournamentService liveTournamentService;

    public TournamentController(TournamentSetupService tournamentSetupService, LiveTournamentService liveTournamentService) {
        this.tournamentSetupService = tournamentSetupService;
        this.liveTournamentService = liveTournamentService;
    }

    /** 🎯 **Setup Tournament** */
    @PostMapping("/setup")
    public ResponseEntity<?> setupTournament(@RequestBody TournamentSetupRequest request) {
        try {
            log.info("🛠️ Setting up tournament: {}", request.getTournamentName());

            Tournament tournament = tournamentSetupService.setupTournament(
                    request.getTournamentName(),
                    request.getNumCourts(),
                    request.getGamesPerTeam(),
                    request.isUseExistingPlayers(),
                    request.isTiered(),
                    request.getStartTime(),
                    request.getMatchDuration()
            );

            log.info("✅ Tournament '{}' setup successfully!", tournament.getName());
            return ResponseEntity.ok(tournament);
        } catch (Exception e) {
            log.error("❌ Error setting up tournament: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to setup tournament.");
        }
    }

    /** 🎯 **Get Active Tournament ID** */
    @GetMapping("/activeTournaments")
    public ResponseEntity<String> getActiveTournament() {
        Optional<String> activeTournamentId = liveTournamentService.getActiveTournament();
        if (activeTournamentId.isPresent()) {
            log.info("🎾 Active Tournament ID: {}", activeTournamentId.get());
            return ResponseEntity.ok(activeTournamentId.get());
        } else {
            log.warn("⚠️ No active tournament found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No active tournament found.");
        }
    }


    /** 🎯 **End Tournament** */
    @PostMapping("/end")
    public ResponseEntity<String> endTournament() {
        try {
            liveTournamentService.endTournament();
            log.info("🏁 Live tournament has been ended.");
            return ResponseEntity.ok("Tournament ended successfully.");
        } catch (Exception e) {
            log.error("❌ Error ending tournament: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to end tournament.");
        }
    }

    /** 🎯 **Get All Tournaments** */
    @GetMapping("/all")
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        List<Tournament> tournaments = liveTournamentService.getAllTournaments();
        if (tournaments.isEmpty()) {
            log.info("📂 No tournaments found.");
        }
        return ResponseEntity.ok(tournaments);
    }

    /** 🎯 **Get Team Standings** */
    @GetMapping("/standings")
    public ResponseEntity<List<String>> getTeamStandings() {
        // Returns a list of team IDs based on standings
        List<String> standings = liveTournamentService.getStandings();
        return ResponseEntity.ok(standings);
    }

    /** 🎯 Get Tournament by ID */
    @GetMapping("/{tournamentId}")
    public ResponseEntity<?> getTournamentById(@PathVariable String tournamentId) {
        Optional<Tournament> tournamentOpt = liveTournamentService.getTournamentById(tournamentId);
        if (tournamentOpt.isPresent()) {
            log.info("✅ Found tournament: {}", tournamentOpt.get().getName());
            return ResponseEntity.ok(tournamentOpt.get());
        } else {
            log.warn("⚠️ Tournament not found for ID: {}", tournamentId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tournament not found.");
        }
    }


    /** 🎯 **Get Matches by Tournament ID** */
    @GetMapping("/{tournamentId}/matches")
    public ResponseEntity<?> getMatchesByTournament(@PathVariable String tournamentId) {
        try {
            Optional<Tournament> tournament = liveTournamentService.getTournamentById(tournamentId);

            if (tournament.isEmpty()) {
                log.warn("⚠️ Tournament not found: {}", tournamentId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tournament not found.");
            }

            List<String> matchIds = liveTournamentService.getMatchesByTournamentId(tournamentId);

            if (matchIds.isEmpty()) {
                log.warn("⚠️ No matches found for Tournament ID: {}", tournamentId);
                return ResponseEntity.ok(List.of()); // ✅ Return empty list instead of 404
            }

            return ResponseEntity.ok(matchIds);
        } catch (Exception e) {
            log.error("❌ Error fetching matches for Tournament ID {}: {}", tournamentId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch matches.");
        }
    }

    /** 🎯 **Get All Matches** */
    @GetMapping("/matches")
    public ResponseEntity<List<String>> getAllMatches() {
        List<String> matchIds = liveTournamentService.getAllMatches();
        if (matchIds.isEmpty()) {
            log.warn("⚠️ No matches found.");
            return ResponseEntity.ok(List.of());
        }

        matchIds.forEach(matchId -> log.info("📡 Match ID in response: {}", matchId));
        return ResponseEntity.ok(matchIds);
    }

    /** 🎯 **Get Matches by Team ID** */
    @GetMapping("/matches/team/{teamId}")
    public ResponseEntity<?> getMatchesByTeam(@PathVariable String teamId) {
        try {
            List<String> matchIds = liveTournamentService.getMatchesByTeam(teamId);
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

    /** 🎯 Get Match by ID */
    @GetMapping("/match/{matchId}")
    public ResponseEntity<?> getMatchById(@PathVariable String matchId) {
        try {
            Optional<Match> matchOpt = liveTournamentService.getMatchById(matchId);
            if (matchOpt.isPresent()) {
                log.info("✅ Match found: {}", matchOpt.get().getId());
                return ResponseEntity.ok(matchOpt.get());
            } else {
                log.warn("⚠️ Match not found for ID: {}", matchId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Match not found.");
            }
        } catch (Exception e) {
            log.error("❌ Error fetching match {}: {}", matchId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch match.");
        }
    }
}

