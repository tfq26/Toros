package com.example.Toros.service;

import com.example.Toros.model.Player;
import com.example.Toros.model.Team;
import com.example.Toros.repository.TeamRepository;
import com.example.Toros.repository.PlayerRepository;
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
    private static final double SKILL_DIVISOR = 1.86983748392031;

    public TeamService(TeamRepository teamRepository, PlayerRepository playerRepository) {
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
    }

    // ✨ NEW: The primary method for creating a new team and its players.
    // This replaces the old `addTeam` method and is what TournamentService will call.
    @Transactional
    public Team createTeam(Team newTeam) {
        // Generate a unique ID for the team itself
        newTeam.setId(generateUniqueTeamId());

        // Before saving the team, ensure its players exist in the database.
        // This handles cases where players are new or are being created along with the team.
        if (newTeam.getPlayer1() != null) {
            playerRepository.save(newTeam.getPlayer1());
        }
        if (newTeam.getPlayer2() != null) {
            playerRepository.save(newTeam.getPlayer2());
        }

        log.info("SERVICE: Creating new team with ID: {}", newTeam.getId());
        return teamRepository.save(newTeam);
    }

    // ✨ REFINED: This is now the single, authoritative method for updating a team.
    // It's safer for REST APIs because it uses the ID from the URL path as the source of truth.
    @Transactional
    public Team updateTeam(String id, Team teamDetails) {
        // 1. Fetch the existing team from the database
        Team existingTeam = teamRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Team not found with ID: " + id));

        // 2. Update the properties of the existing team from the request body
        existingTeam.setName(teamDetails.getName());

        // 3. Handle player updates by saving them first
        if (teamDetails.getPlayer1() != null) {
            playerRepository.save(teamDetails.getPlayer1());
            existingTeam.setPlayer1(teamDetails.getPlayer1());
        } else {
            existingTeam.setPlayer1(null);
        }

        if (teamDetails.getPlayer2() != null) {
            playerRepository.save(teamDetails.getPlayer2());
            existingTeam.setPlayer2(teamDetails.getPlayer2());
        } else {
            existingTeam.setPlayer2(null);
        }

        log.info("SERVICE: Updating team with ID: {}", id);
        return teamRepository.save(existingTeam);
    }

    // ✅ KEPT: This method is perfect for the DELETE /api/teams/{id} endpoint.
    @Transactional
    public void deleteTeam(String teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new NoSuchElementException("Team not found with ID: " + teamId);
        }
        log.info("SERVICE: Deleting team with ID: {}", teamId);
        teamRepository.deleteById(teamId);
    }

    /**
     * ✅ Get the top teams based on wins.
     */
    public List<Team> getTopTeams(int count) {
        List<Team> teams = teamRepository.findAll();
        return teams.stream()
                .sorted(Comparator.comparing(Team::getWins).reversed()) // Sort by wins descending
                .limit(count)
                .collect(Collectors.toList());
    }

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

    /**
     * ✅ Clear all team standings.
     */
    @Transactional
    public void clearStandings() {
        teamRepository.deleteAll();
        log.info("All team standings have been cleared.");
    }

    /**
     * ✅ Generate a unique 8-character alphanumeric team ID, ensuring uniqueness in the DB.
     */
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

    /**
     * ✅ Generate teams dynamically by pairing players.
     * If the number of players is odd, the last team may have only one player.
     */
    @Transactional
    public List<Team> generateTeams() {
        log.info("Generating teams...");

        // Retrieve the list of players.
        List<Player> players = playerRepository.findAll();
        List<Team> teams = new ArrayList<>();

        // Pair players sequentially to form teams.
        for (int i = 0; i < players.size(); i += 2) {
            Team team = new Team();
            team.setPlayer1(players.get(i));
            if (i + 1 < players.size()) {
                team.setPlayer2(players.get(i + 1));
            }
            teams.add(team);
        }

        // Set team names based on players if not already set.
        teams.forEach(team -> {
            if (team.getName() == null || team.getName().isEmpty()) {
                String player1Name = team.getPlayer1() != null ? team.getPlayer1().getName() : "Unknown";
                String player2Name = team.getPlayer2() != null ? team.getPlayer2().getName() : "Unknown";
                team.setName(player1Name + " & " + player2Name);
            }
        });

        teamRepository.saveAll(teams);
        log.info("Successfully saved {} new teams.", teams.size());
        return teams;
    }

    /**
     * ✅ Calculate a team's average skill level.
     * The method adds the skill levels of the players, divides by a specified factor, and rounds up.
     *
     * @param team the team for which the average skill level is calculated.
     * @return the rounded-up average skill level as an integer.
     */
    public int getTeamAverageSkillLevel(Team team) {
        double sum = 0.0;
        if (team.getPlayer1() != null) {
            sum += team.getPlayer1().getSkillLevel();
        }
        if (team.getPlayer2() != null) {
            sum += team.getPlayer2().getSkillLevel();
        }
        return (int) Math.ceil(sum / SKILL_DIVISOR);
    }

    /**
     * ✅ Retrieve all teams.
     *
     * @return List of all teams.
     */
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    /**
     * ✅ Retrieve teams by tournament ID.
     * Assumes that the Team model has a tournamentId property.
     *
     * @param tournamentId the tournament identifier as a String.
     * @return List of teams associated with the given tournament.
     */
    public List<Team> getTeamsByTournamentId(String tournamentId) {
        return teamRepository.findAll().stream()
                .filter(team -> tournamentId.equals(team.getTournamentId()))
                .collect(Collectors.toList());
    }

    /**
     * ✅ Retrieve teams by skill level.
     * Filters teams by comparing the calculated average skill level with the provided skill level.
     *
     * @param skillLevel the target skill level as an integer.
     * @return List of teams that match the given average skill level.
     */
    public List<Team> getTeamsBySkillLevel(int skillLevel) {
        return teamRepository.findAll().stream()
                .filter(team -> getTeamAverageSkillLevel(team) == skillLevel)
                .collect(Collectors.toList());
    }
}
