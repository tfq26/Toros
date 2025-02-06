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

import java.util.*;
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

    /** ✅ Get All Matches */
    public List<Match> getAllMatches() {
        return matchRepository.findAll();
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

            if (team1Score > team2Score) {
                match.setWinner(team1.getTeamName());
                team1.incrementWins();
                team2.incrementLosses();
            } else {
                match.setWinner(team2.getTeamName());
                team2.incrementWins();
                team1.incrementLosses();
            }

            teamRepository.save(team1);
            teamRepository.save(team2);
        }

        matchRepository.save(match);
    }

    /** ✅ End Tournament */
    @Transactional
    public void endTournament() {
        Optional<Tournament> liveTournament = tournamentRepository.findByStatus("LIVE");
        liveTournament.ifPresent(tournament -> {
            tournament.setStatus("COMPLETED");
            tournamentRepository.save(tournament);
            log.info("Tournament {} marked as COMPLETED.", tournament.getName());
        });
    }

    /** ✅ Get Team Standings */
    public List<Team> getStandings() {
        return teamRepository.findAll().stream()
                .sorted(Comparator.comparingInt(Team::getWins).reversed()
                        .thenComparingInt(Team::getLosses))
                .collect(Collectors.toList());
    }

    /** ✅ Get Matches by Team ID */
    public List<Match> getMatchesByTeam(String teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new IllegalArgumentException("Team not found with ID: " + teamId);
        }
        return matchRepository.findByTeam1_IdOrTeam2_Id(teamId, teamId);
    }

    /** ✅ Get Matches by Team Name */
    public List<Match> getMatchesByTeamName(String teamName) {
        List<Team> teams = teamRepository.findAllByTeamName(teamName);
        List<String> teamIds = teams.stream().map(Team::getId).collect(Collectors.toList());

        List<Match> matches = new ArrayList<>();
        for (String teamId : teamIds) {
            matches.addAll(matchRepository.findByTeam1_IdOrTeam2_Id(teamId, teamId));
        }
        return matches;
    }

    /** ✅ Advance a Winner in Knockout Matches */
    @Transactional
    public void advanceWinner(String matchId, String winnerTeamId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        Match nextMatch = matchRepository.findById(match.getNextMatchId())
                .orElseThrow(() -> new IllegalArgumentException("Next match not found."));

        if (nextMatch.getTeam1() == null) {
            nextMatch.setTeam1(teamRepository.findById(winnerTeamId).orElseThrow());
        } else {
            nextMatch.setTeam2(teamRepository.findById(winnerTeamId).orElseThrow());
        }

        matchRepository.save(nextMatch);
    }

    /** ✅ Clear All Matches */
    @Transactional
    public void clearAllMatches() {
        matchRepository.deleteAll();
        log.info("All matches have been cleared from the database.");
    }
}
