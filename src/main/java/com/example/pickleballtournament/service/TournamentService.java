package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Player;
import com.example.pickleballtournament.repository.MatchRepository;
import com.example.pickleballtournament.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TournamentService {

    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;

    public TournamentService(PlayerRepository playerRepository, MatchRepository matchRepository) {
        this.playerRepository = playerRepository;
        this.matchRepository = matchRepository;
    }

    public void setupTournament(int numCourts, int gamesPerTeam, boolean useExistingPlayers, boolean tiered) {
        // Retrieve players
        List<Player> players = retrievePlayers(useExistingPlayers);

        // Group players into tiers if requested
        Map<Integer, List<Player>> tieredPlayers = tiered ? groupPlayersBySkillLevel(players) : Map.of(0, players);

        // Assign players to courts and schedule matches
        Map<Integer, List<List<Player>>> courtAssignments = assignPlayersToCourts(tieredPlayers, numCourts, gamesPerTeam);

        // Initialize matches and save them to the database
        initializeMatches(courtAssignments);

        System.out.println("Court Assignments: " + courtAssignments);
    }

    private List<Player> retrievePlayers(boolean useExistingPlayers) {
        List<Player> players = playerRepository.findAll();

        if (players.isEmpty() && !useExistingPlayers) {
            throw new IllegalStateException("No players found. Please import a player list first.");
        }

        return players;
    }

    private Map<Integer, List<Player>> groupPlayersBySkillLevel(List<Player> players) {
        return players.stream()
                .collect(Collectors.groupingBy(Player::getPlacement)); // Group by skill level (placement)
    }

    private Map<Integer, List<List<Player>>> assignPlayersToCourts(
            Map<Integer, List<Player>> tieredPlayers,
            int numCourts,
            int gamesPerTeam
    ) {
        Map<Integer, List<List<Player>>> courtAssignments = new HashMap<>();

        for (Map.Entry<Integer, List<Player>> entry : tieredPlayers.entrySet()) {
            List<Player> players = entry.getValue();

            // Shuffle players to randomize match order
            Collections.shuffle(players);

            List<List<Player>> courtMatches = new ArrayList<>();

            for (int i = 0; i < gamesPerTeam; i++) {
                List<Player> courtMatch = new ArrayList<>();
                int playerIndex = 0;

                // Assign players to courts
                while (playerIndex < players.size()) {
                    if (courtMatch.size() < 4) {
                        courtMatch.add(players.get(playerIndex));
                    } else {
                        courtMatches.add(new ArrayList<>(courtMatch));
                        courtMatch.clear();
                        courtMatch.add(players.get(playerIndex));
                    }
                    playerIndex++;
                }

                // Add leftover players as a match
                if (!courtMatch.isEmpty()) {
                    courtMatches.add(new ArrayList<>(courtMatch));
                }
            }

            courtAssignments.put(entry.getKey(), courtMatches);
        }

        return courtAssignments;
    }

    private void initializeMatches(Map<Integer, List<List<Player>>> courtAssignments) {
        List<Match> matches = new ArrayList<>();

        for (Map.Entry<Integer, List<List<Player>>> entry : courtAssignments.entrySet()) {
            int courtNumber = 1;
            for (List<Player> matchPlayers : entry.getValue()) {
                if (matchPlayers.size() != 4) {
                    continue; // Ensure valid matches
                }

                Match match = new Match();
                match.setCourtNumber(courtNumber);
                match.setTeam1(matchPlayers.get(0).getName() + " & " + matchPlayers.get(1).getName());
                match.setTeam2(matchPlayers.get(2).getName() + " & " + matchPlayers.get(3).getName());
                match.setTeam1Score(0);
                match.setTeam2Score(0);
                match.setStatus("In Progress");

                matches.add(match);
                courtNumber++;
            }
        }

        matchRepository.saveAll(matches);
    }

    public List<Match> getLiveMatches() {
        return matchRepository.findAll();
    }

    public void updateMatch(String matchId, int team1Score, int team2Score, String status) {
        Match match = matchRepository.findById(matchId).orElseThrow(() -> new IllegalArgumentException("Match not found"));
        match.setTeam1Score(team1Score);
        match.setTeam2Score(team2Score);
        match.setStatus(status);
        matchRepository.save(match);
    }
}
