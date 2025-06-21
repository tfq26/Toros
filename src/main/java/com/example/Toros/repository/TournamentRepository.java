package com.example.Toros.repository;

import com.example.Toros.model.Tournament;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TournamentRepository extends MongoRepository<Tournament, String> {

    /** Get a list of all active tournaments */
    List<Tournament> findByIsActiveTrue();

    /** Find a tournament by name */
    Optional<Tournament> findByNameAndIsActiveTrue(String name);

    /**
     * Find all tournaments where the given userId appears in the players list.
     * You can now call:
     *    tournamentRepository.findByParticipantUserId(userId);
     */
    List<Tournament> findByOrganizer(String organizerId);

    // ✨ Method for finding tournaments by their status (e.g., "ACTIVE", "SETUP", "COMPLETED").
    // Assumes your Tournament model has a field named 'status'.
    List<Tournament> findByStatus(String status);

    // ✨ Method for finding tournaments a user is registered in.
    // Assumes your Tournament model has a list field named 'players'.
    List<Tournament> findByPlayersContaining(String userId);
}
