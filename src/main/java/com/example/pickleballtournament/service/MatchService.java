package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.model.Tournament;
import com.example.pickleballtournament.repository.MatchRepository;
import com.example.pickleballtournament.repository.TeamRepository;
import com.example.pickleballtournament.request.UpdateMatchRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MatchService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;

    public MatchService(MatchRepository matchRepository, TeamRepository teamRepository) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
    }

    /** 📋 Retrieve All Match IDs */
    public List<String> getAllMatches() {
        try {
            List<Match> matches = matchRepository.findAll();
            if (matches.isEmpty()) {
                log.info("⚠️ No matches found.");
            } else {
                log.info("✅ Retrieved {} matches.", matches.size());
            }
            return matches.stream()
                    .map(Match::getId)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Function getAllMatches is throwing an error: {}", e.getMessage(), e);
            throw e;
        }
    }

    /** 🎯 Get Matches by Team ID as a List of Match IDs */
    public List<String> getMatchesByTeam(String teamId) {
        try {
            if (!teamRepository.existsById(teamId)) {
                log.error("❌ Team not found with ID: {}", teamId);
                throw new IllegalArgumentException("Team not found with ID: " + teamId);
            }
            List<Match> matches = matchRepository.findByTeam1_IdOrTeam2_Id(teamId, teamId);
            log.info("✅ Found {} matches for Team ID: {}", matches.size(), teamId);
            return matches.stream()
                    .map(Match::getId)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Function getMatchesByTeam is throwing an error: {}", e.getMessage(), e);
            throw e;
        }
    }

    /** ✅ Fetch a Match by ID */
    public Optional<Match> getMatchById(String matchId) {
        try {
            return matchRepository.findById(matchId);
        } catch (Exception e) {
            log.error("Function getMatchById is throwing an error: {}", e.getMessage(), e);
            throw e;
        }
    }

    /** ✅ Fetch Matches by Tournament ID as a List of Match IDs */
    public List<String> getMatchesByTournamentId(String tournamentId) {
        try {
            return matchRepository.findAll().stream()
                    .filter(match -> match.getTournamentId() != null && tournamentId.equals(match.getTournamentId()))
                    .map(Match::getId)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Function getMatchesByTournamentId is throwing an error: {}", e.getMessage(), e);
            throw e;
        }
    }

    /** 🎯 Update Match and return the Match ID */
    @Transactional
    public String updateMatch(String matchId, UpdateMatchRequest request) {
        try {
            log.info("🔄 Updating Match ID: {} | Scores: {}-{} | Status: {}",
                    matchId, request.getTeam1Score(), request.getTeam2Score(), request.getStatus());

            if (matchId == null || matchId.isBlank()) {
                log.error("❌ Invalid Match ID: {}", matchId);
                throw new IllegalArgumentException("Match ID cannot be null or empty.");
            }

            if (request.getTeam1Score() < 0 || request.getTeam2Score() < 0) {
                log.error("❌ Invalid scores received: {}-{}", request.getTeam1Score(), request.getTeam2Score());
                throw new IllegalArgumentException("Scores cannot be negative.");
            }

            Optional<Match> matchOptional = matchRepository.findById(matchId);
            if (matchOptional.isEmpty()) {
                log.warn("⚠️ Match not found: {}", matchId);
                throw new IllegalArgumentException("Match not found with ID: " + matchId);
            }

            Match match = matchOptional.get();
            Team team1 = match.getTeam1();
            Team team2 = match.getTeam2();

            if (team1 == null || team2 == null) {
                log.error("❌ Match {} has null team references!", match.getId());
                throw new IllegalStateException("Match teams cannot be null.");
            }

            // STEP 1: Retrieve Previous Scores
            int previousTeam1Score = match.getTeam1Score();
            int previousTeam2Score = match.getTeam2Score();

            // STEP 2: Subtract Old Scores from Total Points
            team1.setTotalPoints(team1.getTotalPoints() - previousTeam1Score);
            team2.setTotalPoints(team2.getTotalPoints() - previousTeam2Score);

            // STEP 3: Update Match with New Scores and Status
            match.setTeam1Score(request.getTeam1Score());
            match.setTeam2Score(request.getTeam2Score());
            match.setStatus(request.getStatus());

            // STEP 4: Add New Scores to Total Points
            team1.setTotalPoints(team1.getTotalPoints() + request.getTeam1Score());
            team2.setTotalPoints(team2.getTotalPoints() + request.getTeam2Score());

            // Update standings if match is complete
            if ("Complete".equalsIgnoreCase(request.getStatus())) {
                updateTeamStandings(match);
            }

            // STEP 5: Save Updates
            matchRepository.save(match);
            teamRepository.save(team1);
            teamRepository.save(team2);

            log.info("✅ Match {} updated successfully.", match.getId());
            return match.getId();
        } catch (IllegalArgumentException e) {
            log.error("Function updateMatch is throwing an error: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Function updateMatch is throwing an error: {}", e.getMessage(), e);
            throw e;
        }
    }

    /** 🏆 Helper Method to Update Team Standings */
    private void updateTeamStandings(Match match) {
        try {
            Team team1 = match.getTeam1();
            Team team2 = match.getTeam2();

            if (team1 == null || team2 == null) {
                log.error("Function updateTeamStandings is throwing an error: Match {} has null team references!", match.getId());
                throw new IllegalStateException("Match teams cannot be null.");
            }

            int team1Score = match.getTeam1Score();
            int team2Score = match.getTeam2Score();

            if (team1Score > team2Score) {
                match.setWinner(team1.getName());
                team1.incrementWins();
                team2.incrementLosses();
            } else if (team2Score > team1Score) {
                match.setWinner(team2.getName());
                team2.incrementWins();
                team1.incrementLosses();
            } else {
                log.warn("⚠️ Match {} ended in a tie, no winner assigned.", match.getId());
            }

            // Save updated standings
            teamRepository.save(team1);
            teamRepository.save(team2);
        } catch (Exception e) {
            log.error("Function updateTeamStandings is throwing an error: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Export matches as PDF.
     * In a real implementation, generate the PDF using a library such as iText.
     */
    public byte[] exportMatchesPdf() {
        try {
            List<Match> matches = matchRepository.findAll();
            // For demonstration, we generate a simple string with match count.
            String pdfContent = "Exported PDF content for " + matches.size() + " match(es).";
            return pdfContent.getBytes();
        } catch (Exception e) {
            log.error("Error exporting matches as PDF: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Export matches as an Excel file.
     * In a real implementation, generate the Excel file using a library such as Apache POI.
     */
    public byte[] exportMatchesExcel() {
        try {
            List<Match> matches = matchRepository.findAll();
            // For demonstration, we generate a simple string with match count.
            String excelContent = "Exported Excel content for " + matches.size() + " match(es).";
            return excelContent.getBytes();
        } catch (Exception e) {
            log.error("Error exporting matches as Excel: {}", e.getMessage(), e);
            throw e;
        }
    }
}
