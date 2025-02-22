package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.model.Tournament;
import com.example.pickleballtournament.repository.MatchRepository;
import com.example.pickleballtournament.repository.TeamRepository;
import com.example.pickleballtournament.repository.TournamentRepository;
import com.example.pickleballtournament.request.UpdateMatchRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class LiveTournamentService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;

    public LiveTournamentService(MatchRepository matchRepository, TeamRepository teamRepository, TournamentRepository tournamentRepository) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.tournamentRepository = tournamentRepository;
    }

    /** 🎾 Get Active Tournament */
    public Optional<Tournament> getActiveTournament() {
        Optional<Tournament> tournament = tournamentRepository.findByIsActive(true);
        tournament.ifPresentOrElse(
                t -> log.info("🎾 Active Tournament: {}", t.getName()),
                () -> log.warn("⚠️ No active tournament found.")
        );
        return tournament;
    }

    /** 📂 Retrieve All Tournaments */
    public List<Tournament> getAllTournaments() {
        List<Tournament> tournaments = tournamentRepository.findAll();
        log.info("📂 Retrieved {} tournaments from the database.", tournaments.size());
        return tournaments;
    }

    /** 📋 Retrieve All Matches */
    public List<Match> getAllMatches() {
        List<Match> matches = matchRepository.findAll();
        log.info(matches.isEmpty() ? "⚠️ No matches found." : "✅ Retrieved {} matches.", matches.size());
        return matches;
    }

    /** 📊 Get Standings */
    public List<Team> getStandings() {
        List<Team> teams = teamRepository.findAll();
        log.info(teams.isEmpty() ? "⚠️ No teams found." : "✅ Retrieved {} teams.", teams.size());

        return teams.stream()
                .sorted(Comparator.comparingInt(Team::getWins).reversed()
                        .thenComparingInt(Team::getLosses))
                .collect(Collectors.toList());
    }

    /** 🎯 Get Matches by Team ID */
    public List<Match> getMatchesByTeam(String teamId) {
        if (!teamRepository.existsById(teamId)) {
            log.error("❌ Team not found with ID: {}", teamId);
            throw new IllegalArgumentException("Team not found with ID: " + teamId);
        }
        List<Match> matches = matchRepository.findByTeam1_IdOrTeam2_Id(teamId, teamId);
        log.info("✅ Found {} matches for Team ID: {}", matches.size(), teamId);
        return matches;
    }

    /** 🎯 Update Match */
    @Transactional
    public Match updateMatch(String matchId, UpdateMatchRequest request) {
        log.info("🔄 Updating Match ID: {} | Scores: {}-{} | Status: {}", matchId, request.getTeam1Score(), request.getTeam2Score(), request.getStatus());

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

        // ✅ STEP 1: Retrieve Previous Scores
        int previousTeam1Score = match.getTeam1Score();
        int previousTeam2Score = match.getTeam2Score();

        // ✅ STEP 2: Subtract Old Scores from Total Points
        team1.setTotalPoints(team1.getTotalPoints() - previousTeam1Score);
        team2.setTotalPoints(team2.getTotalPoints() - previousTeam2Score);

        // ✅ STEP 3: Update Match with New Scores
        match.setTeam1Score(request.getTeam1Score());
        match.setTeam2Score(request.getTeam2Score());
        match.setStatus(request.getStatus());

        // ✅ STEP 4: Add New Scores to Total Points
        team1.setTotalPoints(team1.getTotalPoints() + request.getTeam1Score());
        team2.setTotalPoints(team2.getTotalPoints() + request.getTeam2Score());

        if ("Complete".equalsIgnoreCase(request.getStatus())) {
            updateTeamStandings(match);
        }

        // ✅ STEP 5: Save Updates
        matchRepository.save(match);
        teamRepository.save(team1);
        teamRepository.save(team2);

        log.info("✅ Match {} updated successfully.", match.getId());
        return match;
    }


    /** 🏆 Helper Method to Update Team Standings */
    private void updateTeamStandings(Match match) {
        Team team1 = match.getTeam1();
        Team team2 = match.getTeam2();

        if (team1 == null || team2 == null) {
            log.error("❌ Match {} has null team references!", match.getId());
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

        teamRepository.save(team1);
        teamRepository.save(team2);
    }

    /** 🏁 End Tournament */
    @Transactional
    public void endTournament() {
        getActiveTournament().ifPresent(tournament -> {
            tournament.setActive(false);
            tournamentRepository.save(tournament);
            log.info("🏆 Tournament '{}' marked as COMPLETED.", tournament.getName());
        });
    }
}
