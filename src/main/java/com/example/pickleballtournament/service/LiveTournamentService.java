package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.model.Tournament;
import com.example.pickleballtournament.repository.MatchRepository;
import com.example.pickleballtournament.repository.TeamRepository;
import com.example.pickleballtournament.repository.TournamentRepository;
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

    /** ✅ Get Active Tournament */
    public Optional<Tournament> getActiveTournament() {
        Optional<Tournament> tournament = tournamentRepository.findByIsActive(true);
        log.info("Active tournament: {}", tournament.map(Tournament::getName).orElse("None"));
        return tournament;
    }

    /** ✅ Retrieve All Tournaments */
    public List<Tournament> getAllTournaments() {
        List<Tournament> tournaments = tournamentRepository.findAll();
        log.info("Retrieved {} tournaments from the database.", tournaments.size());
        return tournaments;
    }

    /** ✅ Get All Matches */
    public List<Match> getAllMatches() {
        List<Match> matches = matchRepository.findAll();

        if (matches.isEmpty()) {
            log.warn("⚠️ No matches found in the database.");
        } else {
            log.info("✅ Retrieved {} matches from the database.", matches.size());
        }

        return matches;
    }

    /** ✅ Get Standings */
    public List<Team> getStandings() {
        List<Team> teams = teamRepository.findAll();
        if (teams.isEmpty()) {
            log.warn("⚠️ No teams found in the database.");
        }

        return teams.stream()
                .sorted(Comparator.comparingInt(Team::getWins).reversed()
                        .thenComparingInt(Team::getLosses))
                .collect(Collectors.toList());
    }

    /** ✅ Get Matches by Team ID */
    public List<Match> getMatchesByTeam(String teamId) {
        if (!teamRepository.existsById(teamId)) {
            log.error("❌ Team not found with ID: {}", teamId);
            throw new IllegalArgumentException("Team not found with ID: " + teamId);
        }

        List<Match> matches = matchRepository.findByTeam1_IdOrTeam2_Id(teamId, teamId);

        log.info("✅ Found {} matches for team ID: {}", matches.size(), teamId);
        return matches;
    }

    /** ✅ Update Match Status */
    @Transactional
    public void updateMatchStatus(String matchId, int team1Score, int team2Score, String status) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        match.setTeam1Score(team1Score);
        match.setTeam2Score(team2Score);
        match.setStatus(status);

        if ("Complete".equalsIgnoreCase(status)) {
            Team team1 = match.getTeam1();
            Team team2 = match.getTeam2();

            if (team1 == null || team2 == null) {
                log.error("❌ Match {} has null team references!", matchId);
                throw new IllegalStateException("Match teams cannot be null.");
            }

            if (team1Score > team2Score) {
                match.setWinner(team1.getName());
                team1.incrementWins();
                team2.incrementLosses();
            } else {
                match.setWinner(team2.getName());
                team2.incrementWins();
                team1.incrementLosses();
            }

            teamRepository.save(team1);
            teamRepository.save(team2);
        }

        matchRepository.save(match);
        log.info("✅ Match {} updated: {} - {} (Status: {})", matchId, team1Score, team2Score, status);
    }

    /** ✅ End Tournament */
    @Transactional
    public void endTournament() {
        Optional<Tournament> activeTournament = getActiveTournament();
        activeTournament.ifPresent(tournament -> {
            tournament.setActive(false);
            tournamentRepository.save(tournament);
            log.info("✅ Tournament '{}' marked as COMPLETED.", tournament.getName());
        });
    }
}
