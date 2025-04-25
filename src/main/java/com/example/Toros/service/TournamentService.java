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

    /**
     * ✅ Retrieve Tournaments and filter based on status
     */
    public List<Tournament> getTournaments(boolean isActive) {
        try {
            List<Tournament> tournaments;
            if (isActive) {
                tournaments = tournamentRepository.findByIsActiveTrue();
                if (tournaments.isEmpty()) {
                    log.warn("⚠️ No active tournaments found.");
                } else {
                    log.info("🎾 Active Tournaments retrieved: {}", tournaments.size());
                }
            } else {
                tournaments = tournamentRepository.findAll();
                if (tournaments.isEmpty()) {
                    log.info("⚠️ No tournaments retrieved from the database.");
                } else {
                    log.info("📂 Retrieved {} tournaments from the database.", tournaments.size());
                }
            }
            return tournaments;
        } catch (Exception e) {
            log.error("Function getTournaments is throwing an error: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 📊 Get Standings as Team IDs
     */
    public List<String> getStandings() {
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
        // e.g. query by a join table: tournament_participants
        return tournamentRepository.findByParticipantUserId(userId);
    }

    /**
     * ✅ Fetch a Tournament by ID
     */
    public Optional<Tournament> getTournamentById(String tournamentId) {
        try {
            return tournamentRepository.findById(tournamentId);
        } catch (Exception e) {
            log.error("Function getTournamentById is throwing an error: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 🏁 End Active Tournament
     */
    @Transactional
    public void endTournament() {
        try {
            // Retrieve all active tournaments
            List<Tournament> activeTournaments = tournamentRepository.findByIsActiveTrue();

            // For this example, we are ending only the first active tournament
            Optional<Tournament> activeTournamentOpt = activeTournaments.stream().findFirst();

            activeTournamentOpt.ifPresentOrElse(tournament -> {
                tournament.setActive(false);
                tournamentRepository.save(tournament);
                log.info("🏆 Tournament '{}' marked as COMPLETED.", tournament.getName());
            }, () -> log.warn("⚠️ No active tournament found."));
        } catch (Exception e) {
            log.error("Function endTournament is throwing an error: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Registers a user on a tournament by adding their userId to the tournament.players list.
     *
     * @param tournamentId the ID of the tournament to register to
     * @param userId       the ID of the user to register
     * @return the updated Tournament
     * @throws IllegalArgumentException if the tournament does not exist
     */
    @Transactional
    public Tournament register(String tournamentId, String userId) {
        Tournament tour = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found: " + tournamentId));

        if (tour.getPlayers() == null) {
            tour.setPlayers(new ArrayList<>());
        }

        // Return 409 Conflict if already registered
        if (tour.getPlayers().contains(userId)) {
            log.warn("User {} is already registered for tournament {}", userId, tournamentId);
            throw new IllegalStateException("User is already registered for this tournament.");
        }

        tour.getPlayers().add(userId);
        log.info("✅ Registered user {} to tournament {}", userId, tournamentId);

        return tournamentRepository.save(tour);
    }
}
