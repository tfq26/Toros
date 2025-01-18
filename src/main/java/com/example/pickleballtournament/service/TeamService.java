package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.Player;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.repository.TeamRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    /**
     * Fetch all team standings, ensuring valid placements are set.
     *
     * @return List of teams
     */
    public List<Team> getStandings() {
        // Fetch all teams
        List<Team> teams = teamRepository.findAll();

        // Sort teams based on placement, placing "Unranked" teams (placement = 0 or null) at the end
        return teams.stream()
                .sorted(Comparator.comparing(
                        team -> (team.getPlacement() == null || team.getPlacement() == 0)
                                ? Integer.MAX_VALUE
                                : team.getPlacement()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Retrieve a specific team by ID.
     *
     * @param teamId The ID of the team to retrieve
     * @return The Team object if found
     */
    public Team getTeamById(String teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with ID: " + teamId));
    }

    /**
     * Add a new team or update an existing team.
     *
     * @param team The Team object to add or update
     */
    public void addTeam(Team team) {
        teamRepository.save(team);
    }

    /**
     * Delete a specific team by ID.
     *
     * @param teamId The ID of the team to delete
     */
    public void deleteTeam(String teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new IllegalArgumentException("Team not found with ID: " + teamId);
        }
        teamRepository.deleteById(teamId);
    }

    public List<Team> getTopTeams(int count) {
        List<Team> teams = teamRepository.findAll();

        return teams.stream()
                .sorted(Comparator.comparing(Team::getWins).reversed()) // Sort by wins descending
                .limit(count)
                .collect(Collectors.toList());
    }

    /**
     * Clear all team standings.
     */
    public void clearStandings() {
        teamRepository.deleteAll();
    }
}
