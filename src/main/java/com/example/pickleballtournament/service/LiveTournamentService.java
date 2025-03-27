package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.model.Tournament;
import com.example.pickleballtournament.repository.TeamRepository;
import com.example.pickleballtournament.repository.TournamentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class LiveTournamentService {

    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;

    public LiveTournamentService(TournamentRepository tournamentRepository, TeamRepository teamRepository) {
        this.tournamentRepository = tournamentRepository;
        this.teamRepository = teamRepository;
    }

    /** ✅ Retrieve Tournaments and filter based on status */
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

    /** 📊 Get Standings as Team IDs */
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

    /** ✅ Fetch a Tournament by ID */
    public Optional<Tournament> getTournamentById(String tournamentId) {
        try {
            return tournamentRepository.findById(tournamentId);
        } catch (Exception e) {
            log.error("Function getTournamentById is throwing an error: {}", e.getMessage(), e);
            throw e;
        }
    }

    /** 🏁 End Active Tournament */
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
}
