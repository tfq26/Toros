package com.example.Toros.service;

import com.example.Toros.model.Team;
import com.example.Toros.model.Tournament;
import com.example.Toros.repository.TeamRepository;
import com.example.Toros.repository.TournamentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;

    public TournamentService(TournamentRepository tournamentRepository, TeamRepository teamRepository) {
        this.tournamentRepository = tournamentRepository;
        this.teamRepository = teamRepository;
    }

    // ✨ 1. NEW METHOD IMPLEMENTED ✨
    // This is required for the `GET /api/tournaments/my` endpoint.
    public List<Tournament> findTournamentsByOrganizerId(String auth0Id) {
        log.info("SERVICE: Finding tournaments for organizer with Auth0 ID: {}", auth0Id);
        // This relies on a new method in your TournamentRepository
        return tournamentRepository.findByOrganizer(auth0Id);
    }

    // ✨ 2. REFACTORED METHOD ✨
    // This is more explicit than the old getTournaments(boolean isActive) method.
    public List<Tournament> getTournamentsByStatus(String status) {
        log.info("SERVICE: Finding tournaments with status: {}", status);
        // This relies on a new method in your TournamentRepository
        return tournamentRepository.findByStatus(status);
    }

    /**
     * Returns all tournaments.
     */
    public List<Tournament> getAllTournaments() {
        log.info("SERVICE: Finding all tournaments.");
        return tournamentRepository.findAll();
    }

    /**
     * 📊 Get Standings as Team IDs
     */
    public List<String> getStandings() {
        // ... (this method is fine as is)
        try {
            List<Team> teams = teamRepository.findAll();
            if (teams.isEmpty()) {
                log.info("⚠️ No teams found.");
            } else {
                log.info("✅ Retrieved {} teams.", teams.size());
            }
            return teams.stream()
                    .sorted(Comparator.comparingInt(Team::getWins).reversed()
                            .thenComparingInt(Team::getLosses))
                    .map(Team::getId)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Function getStandings is throwing an error: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Returns tournaments where this user is registered
     */
    public List<Tournament> getTournamentsForUser(String userId) {
        // This assumes your repository has a method to find tournaments by participant.
        return tournamentRepository.findByPlayersContaining(userId);
    }

    /**
     * ✅ Fetch a Tournament by ID
     */
    public Optional<Tournament> getTournamentById(String tournamentId) {
        return tournamentRepository.findById(tournamentId);
    }

    /**
     * 🏁 End a specific Tournament
     */
    @Transactional
    public void endTournament(String tournamentId) {
        log.info("SERVICE: Attempting to end tournament with ID: {}", tournamentId);
        // ✨ 3. REFACTORED METHOD ✨
        // This now finds a specific tournament to end, which is more robust.
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found with ID: " + tournamentId));

        tournament.setStatus("COMPLETED"); // Assuming a 'status' field
        tournament.setActive(false);      // And an 'active' field
        tournamentRepository.save(tournament);
        log.info("🏆 Tournament '{}' marked as COMPLETED.", tournament.getName());
    }

    /**
     * Registers a user on a tournament by adding their userId to the tournament.players list.
     */
    @Transactional
    public Tournament register(String tournamentId, String userId) {
        // ... (this method is fine as is)
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
}