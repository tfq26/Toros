package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.Player;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.repository.TeamRepository;
import com.example.pickleballtournament.repository.PlayerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private static final String ALPHANUMERIC_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int ID_LENGTH = 8;

    public TeamService(TeamRepository teamRepository, PlayerRepository playerRepository) {
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
    }

    /** ✅ Fetch all team standings, ensuring valid placements are set. */
    public List<Team> getStandings() {
        List<Team> teams = teamRepository.findAll();
        return teams.stream()
                .sorted(Comparator.comparing(
                        team -> (team.getPlacement() == null || team.getPlacement() == 0)
                                ? Integer.MAX_VALUE
                                : team.getPlacement()
                ))
                .collect(Collectors.toList());
    }

    /** ✅ Retrieve a specific team by ID. */
    public Team getTeamById(String teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with ID: " + teamId));
    }

    /** ✅ Add a new team or update an existing team. */
    public void addTeam(Team team) {
        if (team.getId() == null || team.getId().isEmpty()) {
            team.setId(generateUniqueTeamId());
        }
        teamRepository.save(team);
    }

    /** ✅ Update an existing team without changing its ID. */
    public void updateTeam(Team team) {
        if (!teamRepository.existsById(team.getId())) {
            throw new IllegalArgumentException("Cannot update team. Team does not exist with ID: " + team.getId());
        }
        teamRepository.save(team);
    }

    /** ✅ Delete a specific team by ID. */
    public void deleteTeam(String teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new IllegalArgumentException("Team not found with ID: " + teamId);
        }
        teamRepository.deleteById(teamId);
    }

    /** ✅ Get the top teams based on wins. */
    public List<Team> getTopTeams(int count) {
        List<Team> teams = teamRepository.findAll();
        return teams.stream()
                .sorted(Comparator.comparing(Team::getWins).reversed()) // Sort by wins descending
                .limit(count)
                .collect(Collectors.toList());
    }

    /** ✅ Clear all team standings. */
    @Transactional
    public void clearStandings() {
        teamRepository.deleteAll();
        log.info("All team standings have been cleared.");
    }

    /** ✅ Generate a unique 8-character alphanumeric team ID, ensuring uniqueness in the DB. */
    private String generateUniqueTeamId() {
        Random random = new Random();
        String uniqueId;

        do {
            StringBuilder idBuilder = new StringBuilder();
            for (int i = 0; i < ID_LENGTH; i++) {
                int index = random.nextInt(ALPHANUMERIC_CHARS.length());
                idBuilder.append(ALPHANUMERIC_CHARS.charAt(index));
            }
            uniqueId = idBuilder.toString();
        } while (teamRepository.existsById(uniqueId)); // Ensure uniqueness in DB

        return uniqueId;
    }

    /** ✅ Generate teams dynamically by pairing players */
    @Transactional
    public List<Team> generateTeams() {
        log.info("Generating teams...");

        // Retrieve all players
        List<Player> players = playerRepository.findAll();
        if (players.size() < 2) {
            throw new IllegalStateException("Not enough players to form teams.");
        }

        // Group players based on predefined logic (example: pairing by order)
        List<Team> teams = new ArrayList<>();
        for (int i = 0; i < players.size(); i += 2) {
            if (i + 1 < players.size()) {
                Player player1 = players.get(i);
                Player player2 = players.get(i + 1);

                Team team = new Team();
                team.setId(generateUniqueTeamId());
                team.setName(player1.getName() + " & " + player2.getName());
                team.setPlayers(player1, player2);
                team.setWins(0);
                team.setLosses(0);
                teams.add(team);
            }
        }

        // Save teams
        teamRepository.saveAll(teams);
        log.info("Generated and saved {} teams.", teams.size());

        return teams;
    }
}
