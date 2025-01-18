package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Player;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.repository.MatchRepository;
import com.example.pickleballtournament.repository.PlayerRepository;
import com.example.pickleballtournament.repository.TeamRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.function.BiConsumer;

@Slf4j
@Service
public class TournamentService {

    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final TeamService teamService;

    public TournamentService(PlayerRepository playerRepository, MatchRepository matchRepository, TeamRepository teamRepository, TeamService teamService) {
        this.playerRepository = playerRepository;
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.teamService = teamService;
    }

    @Transactional
    public void setupTournament(int numCourts, int gamesPerTeam, boolean useExistingPlayers, boolean tiered, LocalTime startTime, int matchDuration) {
        // Clear all existing matches
        matchRepository.deleteAll();
        log.info("All existing matches have been deleted.");

        // Clear all existing teams
        teamRepository.deleteAll();
        log.info("All existing teams have been deleted.");

        // Generate or retrieve teams
        List<Team> teams = setupAndGenerateTeams();

        if (teams.isEmpty()) {
            throw new IllegalArgumentException("No teams available for the tournament.");
        }

        // Fetch standings from TeamService
        List<Team> standings = teamService.getStandings();

        // Use standings to generate matches
        List<Match> matches = generateMatches(standings, numCourts, gamesPerTeam, tiered, startTime, matchDuration);

        if (matches.isEmpty()) {
            throw new IllegalStateException("No matches generated. Please check the input parameters.");
        }

        // Save matches
        matchRepository.saveAll(matches);
        log.info("Saved {} matches to the database.", matches.size());
    }

    @Transactional
    public List<Team> setupAndGenerateTeams() {
        // Clear all existing teams from the repository
        teamRepository.deleteAll();
        log.info("Cleared all existing teams from the repository.");

        // Fetch all players from the repository
        List<Player> players = playerRepository.findAll();
        if (players.isEmpty()) {
            throw new IllegalStateException("No players found in the repository. Cannot create teams.");
        }

        // Group players by their teamNumber
        Map<Integer, List<Player>> groupedPlayers = players.stream()
                .filter(player -> player.getTeamNumber() != null) // Only include players with a valid teamNumber
                .collect(Collectors.groupingBy(Player::getTeamNumber));

        List<Team> teams = new ArrayList<>();

        // Create teams from grouped players
        for (Map.Entry<Integer, List<Player>> entry : groupedPlayers.entrySet()) {
            List<Player> teamPlayers = entry.getValue();

            if (teamPlayers.size() == 2) { // Only create teams with exactly 2 players
                Player player1 = teamPlayers.get(0);
                Player player2 = teamPlayers.get(1);

                // Generate the team name
                String teamName = player1.getName() + " & " + player2.getName();

                // Create and configure the team
                Team team = new Team();
                team.setName(teamName);
                team.setPlayers(player1, player2);
                team.getTeamPlacement();

                teams.add(team);
                log.info("Created team: {}", teamName);
            } else {
                // Log a warning for invalid team sizes
                log.warn("Invalid team size for teamNumber {}: {} players found.", entry.getKey(), teamPlayers.size());
            }
        }

        // Save valid teams to the repository
        teamRepository.saveAll(teams);
        log.info("Successfully created and saved {} teams.", teams.size());

        // Throw an exception if no valid teams were created
        if (teams.isEmpty()) {
            throw new IllegalStateException("No valid teams were created. Ensure players are paired correctly by teamNumber.");
        }

        return teams;
    }


    private List<Match> generateMatches(List<Team> teams, int numCourts, int gamesPerTeam, boolean tiered, LocalTime startTime, int matchDuration) {
        Map<Integer, List<Match>> courtAssignments = assignPlayersToCourts(teams, numCourts, gamesPerTeam, tiered, startTime, matchDuration, 1);

        List<Match> matches = courtAssignments.values().stream()
                .flatMap(Collection::stream)
                .collect(Collectors.toList());

        // Assign custom IDs to matches
        matches.forEach(Match::generateCustomId);

        log.info("Generated {} matches.", matches.size());
        return matches;
    }

    private Map<Integer, List<Match>> assignPlayersToCourts(
            List<Team> teams,
            int numCourts,
            int gamesPerTeam,
            boolean tiered,
            LocalTime startTime,
            int matchDuration,
            int prioritizedPlacement // New parameter for prioritized placement
    ) {
        Map<Integer, List<Match>> courtAssignments = new HashMap<>();
        for (int i = 1; i <= numCourts; i++) {
            courtAssignments.put(i, new ArrayList<>());
        }

        // Group teams by placement if tiered is enabled
        Map<Integer, List<Team>> groupedTeams = tiered
                ? teams.stream().collect(Collectors.groupingBy(Team::getPlacement))
                : Collections.singletonMap(0, teams);

        // Extract the prioritized group and process it first
        List<Team> prioritizedGroup = groupedTeams.getOrDefault(prioritizedPlacement, new ArrayList<>());
        groupedTeams.remove(prioritizedPlacement); // Remove prioritized group from the main group map

        AtomicInteger courtNumber = new AtomicInteger(1); // Use AtomicInteger for mutable state
        Map<Integer, LocalTime> courtTimes = new HashMap<>();
        for (int i = 1; i <= numCourts; i++) {
            courtTimes.put(i, startTime); // Initialize each court's schedule
        }

        // Define the BiConsumer for generating matches
        BiConsumer<List<Team>, Integer> generateMatchesForGroup = (group, groupGamesPerTeam) -> {
            Collections.shuffle(group); // Randomize team order

            for (int game = 0; game < groupGamesPerTeam; game++) {
                for (int i = 0; i < group.size(); i++) {
                    for (int j = i + 1; j < group.size(); j++) {
                        Team team1 = group.get(i);
                        Team team2 = group.get(j);

                        Match match = new Match();
                        match.setCourtNumber(courtNumber.get());
                        match.setTeam1(team1);
                        match.setTeam2(team2);
                        match.setTeam1Score(0);
                        match.setTeam2Score(0);
                        match.setStatus("Scheduled");

                        LocalTime currentStartTime = courtTimes.get(courtNumber.get());
                        LocalTime currentEndTime = currentStartTime.plusMinutes(matchDuration);

                        match.setStartTime(currentStartTime);
                        match.setEndTime(currentEndTime);

                        courtTimes.put(courtNumber.get(), currentEndTime); // Update court's next available time
                        courtAssignments.get(courtNumber.get()).add(match);

                        courtNumber.set((courtNumber.get() % numCourts) + 1); // Rotate to the next court
                    }
                }
            }
        };

        // First, generate matches for the prioritized group
        if (!prioritizedGroup.isEmpty()) {
            generateMatchesForGroup.accept(prioritizedGroup, gamesPerTeam);
        }

        // Generate matches for the remaining groups
        for (List<Team> group : groupedTeams.values()) {
            generateMatchesForGroup.accept(group, gamesPerTeam);
        }

        return courtAssignments;
    }


    // Custom ID generator
    private String generateCustomId() {
        return "MATCH-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }

    public List<Match> getMatchesByTeam(String teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new IllegalArgumentException("Team not found with ID: " + teamId);
        }
        System.out.print("Team ID: " + teamId + "\n");
        return matchRepository.findByTeamId(teamId);
    }

    public List<Team> getStandings() {
        return teamService.getStandings();
    }

    @Transactional
    public void updateMatchStatus(String matchId, int team1Score, int team2Score, String status) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with ID: " + matchId));

        match.setTeam1Score(team1Score);
        match.setTeam2Score(team2Score);
        match.setStatus(status);

        if ("Complete".equalsIgnoreCase(status)) {
            Team team1 = match.getTeam1();
            Team team2 = match.getTeam2();

            if (team1Score > team2Score) {
                match.setWinner(team1.getName());
                match.setLoser(team2.getName());
                team1.incrementWins();
                team2.incrementLosses();
            } else if (team2Score > team1Score) {
                match.setWinner(team2.getName());
                match.setLoser(team1.getName());
                team2.incrementWins();
                team1.incrementLosses();
            } else {
                throw new IllegalArgumentException("A match cannot be completed with tied scores.");
            }

            team1.incrementMatchesPlayed();
            team2.incrementMatchesPlayed();
            teamRepository.save(team1);
            teamRepository.save(team2);
        }

        matchRepository.save(match);
    }



    public List<Match> getAllMatches() {
        log.info("Fetching all matches from the repository.");
        List<Match> matches = matchRepository.findAll();

        if (matches.isEmpty()) {
            log.warn("No matches found in the repository.");
        } else {
            log.info("Retrieved {} matches from the repository.", matches.size());
        }

        return matches;
    }

    public List<Match> getMatchesByTeamName(String teamName) {
        if (teamName == null || teamName.isEmpty()) {
            throw new IllegalArgumentException("Team name must not be null or empty.");
        }

        List<Match> matches = matchRepository.findByTeamName(teamName);

        if (matches.isEmpty()) {
            log.warn("No matches found for team name: {}", teamName);
        } else {
            log.info("Found {} matches for team name: {}", matches.size(), teamName);
        }

        return matches;
    }

    @Transactional
    public void createKnockoutMatches(List<Team> teams) {
        if (teams.size() < 2) throw new IllegalArgumentException("Not enough teams for knockout.");

        int round = 1;
        Queue<Match> queue = new LinkedList<>();

        // Create initial matches
        for (int i = 0; i < teams.size(); i += 2) {
            Match match = new Match();
            match.setTeam1(teams.get(i));
            match.setTeam2(i + 1 < teams.size() ? teams.get(i + 1) : null); // Handle odd teams
            match.setStatus("Scheduled");
            match.setRound(round);
            matchRepository.save(match);
            queue.add(match);
        }

        // Create knockout brackets
        while (queue.size() > 1) {
            List<Match> currentRound = new ArrayList<>();
            while (!queue.isEmpty()) {
                Match match1 = queue.poll();
                Match match2 = queue.poll();

                Match nextMatch = new Match();
                nextMatch.setStatus("Scheduled");
                nextMatch.setRound(++round);

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

    @Transactional
    public void advanceWinner(String matchId, String winnerTeamId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        if (!"Complete".equalsIgnoreCase(match.getStatus())) {
            throw new IllegalStateException("Match is not completed yet.");
        }

        Match nextMatch = matchRepository.findById(match.getNextMatchId())
                .orElseThrow(() -> new IllegalArgumentException("Next match not found."));

        if (nextMatch.getTeam1() == null) {
            nextMatch.setTeam1(teamRepository.findById(winnerTeamId).orElseThrow());
        } else if (nextMatch.getTeam2() == null) {
            nextMatch.setTeam2(teamRepository.findById(winnerTeamId).orElseThrow());
        }

        matchRepository.save(nextMatch);
    }

    public void endTournament() {
        matchRepository.deleteAll();
        teamRepository.deleteAll();
        log.info("Tournament ended. All matches have been deleted.");
    }
}
