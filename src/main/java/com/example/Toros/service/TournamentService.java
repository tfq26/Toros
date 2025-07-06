package com.example.Toros.service;

import com.example.Toros.model.Team;
import com.example.Toros.model.Tournament;
import com.example.Toros.repository.TournamentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TeamService teamService;

    public TournamentService(TournamentRepository tournamentRepository, TeamService teamService) {
        this.tournamentRepository = tournamentRepository;
        this.teamService = teamService;
    }

    // --- Core Methods Required by Your Controller ---

    // ✨ FIXED: Now calls the correct repository method with aggregation.
    public List<Tournament> getAllTournaments() {
        log.info("SERVICE: Finding and populating all tournaments.");
        return tournamentRepository.findAllAndPopulate();
    }

    // ✨ FIXED: Now calls the correct repository method with aggregation.
    public List<Tournament> findTournamentsByOrganizerId(String auth0Id) {
        log.info("SERVICE: Finding and populating tournaments for organizer with Auth0 ID: {}", auth0Id);
        return tournamentRepository.findByAuth0IdAndPopulate(auth0Id);
    }

    public List<Tournament> getTournamentsByStatus(String status) {
        log.info("SERVICE: Finding tournaments with status: {}", status);
        return tournamentRepository.findByStatus(status);
    }

    public Optional<Tournament> getTournamentById(String tournamentId) {
        return tournamentRepository.findAndPopulateById(tournamentId);
    }

    @Transactional
    public Team addTeamToTournament(String tournamentId, Team newTeam) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new NoSuchElementException("Tournament not found with ID: " + tournamentId));
        Team createdTeam = teamService.createTeam(newTeam);
        createdTeam.setTournamentId(tournamentId);
        teamService.updateTeam(createdTeam.getId(), createdTeam);
        if (tournament.getTeams() == null) {
            tournament.setTeams(new ArrayList<>());
        }
        tournament.getTeams().add(createdTeam);
        tournamentRepository.save(tournament);
        return createdTeam;
    }

    @Transactional
    public void endTournament(String tournamentId) {
        log.info("SERVICE: Attempting to end tournament with ID: {}", tournamentId);
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found with ID: " + tournamentId));
        tournament.setStatus("COMPLETED");
        tournament.setActive(false);
        tournamentRepository.save(tournament);
        log.info("🏆 Tournament '{}' marked as COMPLETED.", tournament.getName());
    }

    @Transactional
    public Tournament register(String tournamentId, String userId) {
        Tournament tour = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found: " + tournamentId));
        if (tour.getPlayers() == null) {
            tour.setPlayers(new ArrayList<>());
        }
        if (tour.getPlayers().contains(userId)) {
            log.warn("User {} is already registered for tournament {}", userId, tournamentId);
            throw new IllegalStateException("User is already registered for this tournament.");
        }
        tour.getPlayers().add(userId);
        log.info("✅ Registered user {} to tournament {}", userId, tournamentId);
        return tournamentRepository.save(tour);
    }

    public List<Team> getStandings() {
        log.info("SERVICE: Fetching team standings via TeamService.");
        return teamService.getStandings();
    }

    // ✨ NEWLY ADDED: The missing method that caused the compile error.
    /**
     * ✅ REQUIRED: Returns tournaments where this user is registered as a player.
     */
    public List<Tournament> getTournamentsForUser(String userId) {
        log.info("SERVICE: Finding tournaments where user {} is registered.", userId);
        return tournamentRepository.findByPlayersContaining(userId);
    }
}