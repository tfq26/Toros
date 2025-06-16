package com.example.Toros.controller;

import com.example.Toros.model.Match;
import com.example.Toros.request.UpdateMatchRequest;
import com.example.Toros.service.MatchService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
// ✨ FIXED: Standardized the base URL to `/api/match` (singular) to align with frontend calls.
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

    /** 🎯 Get All Match IDs */
    @GetMapping
    public ResponseEntity<List<String>> getAllMatchIds() {
        List<String> matchIds = matchService.getAllMatches();
        if (matchIds.isEmpty()) {
            log.warn("⚠️ No matches found.");
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(matchIds);
    }

    /** 🎯 Get Match IDs by Team ID */
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

    /** 🎯 Get Match IDs by Tournament ID */
    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<?> getMatchesByTournament(@PathVariable String tournamentId) {
        try {
            List<String> matchIds = matchService.getMatchesByTournamentId(tournamentId);
            if (matchIds.isEmpty()) {
                log.warn("⚠️ No matches found for Tournament ID: {}", tournamentId);
                return ResponseEntity.ok(List.of());
            }
            return ResponseEntity.ok(matchIds);
        } catch (Exception e) {
            log.error("❌ Error fetching matches for Tournament ID {}: {}", tournamentId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch matches for tournament.");
        }
    }

    /** 🎯 Update Match */
    // ✨ FIXED: The path is now simply /{id}, which correctly resolves to /api/match/{id}.
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateMatch(@PathVariable String id, @RequestBody UpdateMatchRequest request) {
        try {
            log.info("📥 Received match update request: Match ID={}, Team1Score={}, Team2Score={}, Status={}",
                    id, request.getTeam1Score(), request.getTeam2Score(), request.getStatus());
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

    /**
     * Export matches as a PDF file.
     */
    @GetMapping("/export/pdf")
    public ResponseEntity<Resource> exportMatchesPdf() {
        try {
            byte[] pdfBytes = matchService.exportMatchesPdf();
            ByteArrayResource resource = new ByteArrayResource(pdfBytes);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=matches.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(pdfBytes.length)
                    .body(resource);
        } catch (Exception e) {
            log.error("❌ Error exporting matches as PDF: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Export matches as an Excel file.
     */
    @GetMapping("/export/excel")
    public ResponseEntity<Resource> exportMatchesExcel() {
        try {
            byte[] excelBytes = matchService.exportMatchesExcel();
            ByteArrayResource resource = new ByteArrayResource(excelBytes);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=matches.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .contentLength(excelBytes.length)
                    .body(resource);
        } catch (Exception e) {
            log.error("❌ Error exporting matches as Excel: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
