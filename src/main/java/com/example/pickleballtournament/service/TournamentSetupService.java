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
     * ✅ Setup the Tournament without deleting previous data:
     * - Generates new teams and matches.
     * - Assigns the Tournament object to each match.
     * - Saves the tournament with references to new teams and matches.
     */
    @Transactional
    public Tournament setupTournament(String tournamentName, int numCourts, int gamesPerTeam, boolean useExistingPlayers,
                                      boolean tiered, LocalTime startTime, int matchDuration) {
        log.info("Setting up new tournament: {}", tournamentName);

        // ✅ Check if a tournament with the same name already exists
        Optional<Tournament> existingTournament = tournamentRepository.findByName(tournamentName);
        if (existingTournament.isPresent()) {
            throw new IllegalStateException("A tournament with this name already exists.");
        }

        // ✅ Generate teams (without clearing previous teams)
        List<Team> teams = setupAndGenerateTeams();
        if (teams.isEmpty()) {
            throw new IllegalStateException("No teams available for the tournament.");
        }

        // ✅ Create and Save Tournament First
        Tournament tournament = new Tournament();
        tournament.setName(tournamentName);
        tournament.setDateHeld(LocalDate.now());
        tournament.setActive(true);
        tournament.setNumCourts(numCourts);
        tournament.setGamesPerTeam(gamesPerTeam);
        tournament.setTiered(tiered);
        tournament.setTeams(teams);
        tournament.setStatus("LIVE");

        tournament = tournamentRepository.save(tournament);
        log.info("✅ Tournament '{}' saved successfully with ID: {}", tournament.getName(), tournament.getId());

        // ✅ Generate matches and assign the Tournament object
        List<Match> matches = generateMatches(tournament, teams, numCourts, gamesPerTeam, tiered, startTime, matchDuration);
        matchRepository.saveAll(matches);
        log.info("✅ Saved {} matches for Tournament '{}'", matches.size(), tournament.getName());

        // ✅ Update Tournament with matches
        tournament.setMatches(matches);
        tournamentRepository.save(tournament);

        return tournament;
    }

    /** ✅ Generate Teams without deleting previous ones */
    @Transactional
    public List<Team> setupAndGenerateTeams() {
        log.info("Generating teams...");

        // ✅ Generate teams while preserving existing ones
        List<Team> teams = teamService.generateTeams();

        teams.forEach(team -> {
            if (team.getName() == null || team.getName().isEmpty()) {
                String player1Name = team.getPlayer1() != null ? team.getPlayer1().getName() : "Unknown";
                String player2Name = team.getPlayer2() != null ? team.getPlayer2().getName() : "Unknown";
                team.setName(player1Name + " & " + player2Name);
            }
        });

        teamRepository.saveAll(teams);
        log.info("✅ Successfully saved {} new teams.", teams.size());

        return teams;
    }

    /** ✅ Generate Matches and Assign the Tournament Object */
    private List<Match> generateMatches(Tournament tournament, List<Team> teams, int numCourts, int gamesPerTeam, boolean tiered,
                                        LocalTime startTime, int matchDuration) {
        log.info("Generating matches for Tournament '{}' (ID: {}) | {} teams with {} courts.",
                tournament.getName(), tournament.getId(), teams.size(), numCourts);

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
                    match.setTournament(tournament); // ✅ Assign Tournament Object
                    match.setTeam1(team1);
                    match.setTeam2(team2);
                    match.setTeam1Score(0);
                    match.setTeam2Score(0);
                    match.setStatus("Scheduled");
                    match.setCourtNumber(assignedCourt);
                    match.setStartTime(matchStartTime);
                    match.setEndTime(matchEndTime);
                    match.generateCustomId();

                    log.info("✅ Match Scheduled: {} vs {} on Court {} for Tournament '{}'",
                            team1.getName(), team2.getName(), assignedCourt, tournament.getName());

                    matches.add(match);
                    courtTimes.put(assignedCourt, matchEndTime);
                    courtNumber.set((courtNumber.get() % numCourts) + 1);
                }
            }
        }

        log.info("✅ Generated {} matches for Tournament '{}'", matches.size(), tournament.getName());
        return matches;
    }
}
