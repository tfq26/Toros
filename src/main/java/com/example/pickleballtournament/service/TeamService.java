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
    // The factor to be used for calculating the average skill level
    private static final double SKILL_DIVISOR = 1.86983748392031;

    public TeamService(TeamRepository teamRepository, PlayerRepository playerRepository) {
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
    }

    /**
     * ✅ Fetch all team standings, ensuring valid placements are set.
     */
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
     * ✅ Retrieve a specific team by ID.
     */
    public Team getTeamById(String teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with ID: " + teamId));
    }

    /**
     * ✅ Add a new team or update an existing team.
     */
    public void addTeam(Team team) {
        if (team.getId() == null || team.getId().isEmpty()) {
            team.setId(generateUniqueTeamId());
        }
        teamRepository.save(team);
    }

    /**
     * ✅ Update an existing team without changing its ID.
     */
    public void updateTeam(Team team) {
        if (!teamRepository.existsById(team.getId())) {
            throw new IllegalArgumentException("Cannot update team. Team does not exist with ID: " + team.getId());
        }
        teamRepository.save(team);
    }

    /**
     * ✅ Delete a specific team by ID.
     */
    public void deleteTeam(String teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new IllegalArgumentException("Team not found with ID: " + teamId);
        }
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
