package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.request.UpdateMatchRequest;
import com.example.pickleballtournament.service.MatchService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/matches")
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
    @RequestMapping(value = "/{id}", method = RequestMethod.PATCH)
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
