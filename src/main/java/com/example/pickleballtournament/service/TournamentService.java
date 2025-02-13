package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.model.Tournament;
import com.example.pickleballtournament.repository.MatchRepository;
import com.example.pickleballtournament.repository.TeamRepository;
import com.example.pickleballtournament.repository.TournamentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TournamentService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamService teamService;
    private final ObjectMapper objectMapper = new ObjectMapper(); // Jackson for JSON conversion

    public TournamentService(MatchRepository matchRepository, TeamRepository teamRepository, TournamentRepository tournamentRepository, TeamService teamService) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.tournamentRepository = tournamentRepository;
        this.teamService = teamService;
    }

    /** ✅ Retrieve All Matches with Debugging */
    public List<Match> getAllMatches() {
        List<Match> matches = matchRepository.findAll();
        logData("Retrieved Matches", matches);
        return matches;
    }

    /** ✅ Retrieve All Teams with Debugging */
    public List<Team> getAllTeams() {
        List<Team> teams = teamRepository.findAll();
        logData("Retrieved Teams", teams);
        return teams;
    }

    /** ✅ Retrieve Tournament Data */
    public List<Tournament> getAllTournaments() {
        List<Tournament> tournaments = tournamentRepository.findAll();
        logData("Retrieved Tournaments", tournaments);
        return tournaments;
    }

    /** ✅ Get Standings with Debugging */
    public List<Team> getStandings() {
        List<Team> teams = teamRepository.findAll();
        logData("Retrieved Team Standings", teams);

        return teams.stream()
                .sorted(Comparator.comparingInt(Team::getWins).reversed()
                        .thenComparingInt(Team::getLosses))
                .collect(Collectors.toList());
    }

    /** ✅ Get Matches by Team ID with Debugging */
    public List<Match> getMatchesByTeam(String teamId) {
        if (!teamRepository.existsById(teamId)) {
            log.warn("Team not found with ID: {}", teamId);
            throw new IllegalArgumentException("Team not found with ID: " + teamId);
        }
        List<Match> matches = matchRepository.findByTeam1_IdOrTeam2_Id(teamId, teamId);
        logData("Matches for Team ID " + teamId, matches);
        return matches;
    }

    /** ✅ Get Matches by Team Name with Debugging */
    public List<Match> getMatchesByTeamName(String teamName) {
        List<Team> teams = teamRepository.findAllByTeamName(teamName);
        List<String> teamIds = teams.stream().map(Team::getId).collect(Collectors.toList());

        List<Match> matches = new ArrayList<>();
        for (String teamId : teamIds) {
            matches.addAll(matchRepository.findByTeam1_IdOrTeam2_Id(teamId, teamId));
        }
        logData("Matches for Team Name " + teamName, matches);
        return matches;
    }

    /** ✅ Debugging Method to Log Data in JSON Format */
    private void logData(String message, Object data) {
        try {
            String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(data);
            log.info("{}:\n{}", message, json);
        } catch (Exception e) {
            log.error("Error converting data to JSON for logging", e);
        }
    }

    /** ✅ Get Active Tournament */
    public Optional<Tournament> getActiveTournament() {
        return tournamentRepository.findByStatus("LIVE");
    }

}
