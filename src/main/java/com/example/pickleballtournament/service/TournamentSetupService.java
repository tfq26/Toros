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

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TournamentSetupService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamService teamService;

    public TournamentSetupService(MatchRepository matchRepository, TeamRepository teamRepository,
                                  TournamentRepository tournamentRepository, TeamService teamService) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.tournamentRepository = tournamentRepository;
        this.teamService = teamService;
    }

    /**
     * Setup the Tournament:
     * - Clears previous matches, teams, and tournaments.
     * - Generates new teams and matches.
     * - Saves matches separately and then creates a Tournament document referencing those matches.
     */
    @Transactional
    public Tournament setupTournament(String tournamentName, int numCourts, int gamesPerTeam, boolean useExistingPlayers,
                                      boolean tiered, LocalTime startTime, int matchDuration) {
        log.info("Setting up new tournament: {}", tournamentName);

        // Clear previous data
        matchRepository.deleteAll();
        teamRepository.deleteAll();
        tournamentRepository.deleteAll();
        log.info("Cleared all existing tournaments, matches, and teams.");

        // Generate teams
        List<Team> teams = setupAndGenerateTeams();
        if (teams.isEmpty()) {
            throw new IllegalStateException("No teams available for the tournament.");
        }

        // Generate matches
        List<Match> matches = generateMatches(teams, numCourts, gamesPerTeam, tiered, startTime, matchDuration);
        // Explicitly save matches to the MongoDB collection
        matchRepository.saveAll(matches);
        log.info("Saved {} matches to the match collection.", matches.size());

        // Create and Save Tournament with references to teams and matches
        Tournament tournament = new Tournament();
        tournament.setName(tournamentName);
        tournament.setDateHeld(LocalDate.now());
        tournament.setActive(true);
        tournament.setNumCourts(numCourts);
        tournament.setGamesPerTeam(gamesPerTeam);
        tournament.setTiered(tiered);
        tournament.setTeams(teams);
        tournament.setMatches(matches);
        // Optionally, you can set an initial status for the tournament if needed
        tournament.setStatus("LIVE");

        tournamentRepository.save(tournament);
        log.info("Tournament '{}' saved successfully!", tournament.getName());

        return tournament;
    }

    /** Generate Teams */
    @Transactional
    public List<Team> setupAndGenerateTeams() {
        log.info("Generating teams...");
        teamRepository.deleteAll();

        List<Team> teams = teamService.generateTeams();
        teamRepository.saveAll(teams);
        log.info("Successfully saved {} teams.", teams.size());

        return teams;
    }

    /** Generate Matches */
    private List<Match> generateMatches(List<Team> teams, int numCourts, int gamesPerTeam, boolean tiered,
                                        LocalTime startTime, int matchDuration) {
        log.info("Generating matches for {} teams with {} courts.", teams.size(), numCourts);

        if (teams.size() < 2) {
            throw new IllegalStateException("Not enough teams to generate matches.");
        }

        List<Match> matches = new ArrayList<>();
        Map<Integer, List<Team>> groupedTeams = tiered
                ? teams.stream().collect(Collectors.groupingBy(team -> team.getPlacement() != null ? team.getPlacement() : 0))
                : Collections.singletonMap(0, teams);

        AtomicInteger courtNumber = new AtomicInteger(1);
        Map<Integer, LocalTime> courtTimes = new HashMap<>();
        for (int i = 1; i <= numCourts; i++) {
            courtTimes.put(i, startTime);
        }

        for (List<Team> group : groupedTeams.values()) {
            Collections.shuffle(group);
            for (int i = 0; i < group.size(); i++) {
                for (int j = i + 1; j < group.size(); j++) {
                    if (matches.size() >= gamesPerTeam * teams.size() / 2) break;

                    Team team1 = group.get(i);
                    Team team2 = group.get(j);
                    int assignedCourt = courtNumber.get();
                    LocalTime matchStartTime = courtTimes.get(assignedCourt);
                    LocalTime matchEndTime = matchStartTime.plusMinutes(matchDuration);

                    Match match = new Match();
                    match.setTeam1(team1);
                    match.setTeam2(team2);
                    match.setTeam1Score(0);
                    match.setTeam2Score(0);
                    match.setStatus("Scheduled");
                    match.setCourtNumber(assignedCourt);
                    match.setStartTime(matchStartTime);
                    match.setEndTime(matchEndTime);
                    match.generateCustomId();

                    matches.add(match);
                    courtTimes.put(assignedCourt, matchEndTime);
                    courtNumber.set((courtNumber.get() % numCourts) + 1);
                }
            }
        }

        log.info("Generated {} matches.", matches.size());
        return matches;
    }

    /** Create Knockout Matches */
    @Transactional
    public void createKnockoutMatches(List<Team> teams) {
        if (teams.size() < 2) throw new IllegalArgumentException("Not enough teams for knockout.");

        Queue<Match> queue = new LinkedList<>();
        for (int i = 0; i < teams.size(); i += 2) {
            Match match = new Match();
            match.setTeam1(teams.get(i));
            match.setTeam2(i + 1 < teams.size() ? teams.get(i + 1) : null);
            match.setStatus("Scheduled");
            matchRepository.save(match);
            queue.add(match);
        }

        while (queue.size() > 1) {
            List<Match> currentRound = new ArrayList<>();
            while (!queue.isEmpty()) {
                Match match1 = queue.poll();
                Match match2 = queue.poll();
                Match nextMatch = new Match();
                nextMatch.setStatus("Scheduled");

                match1.setNextMatchId(nextMatch.getId());
                if (match2 != null) {
                    match2.setNextMatchId(nextMatch.getId());
                }

                currentRound.add(nextMatch);
                matchRepository.save(match1);
                if (match2 != null) matchRepository.save(match2);
            }
            queue.addAll(currentRound);
        }
    }
}
