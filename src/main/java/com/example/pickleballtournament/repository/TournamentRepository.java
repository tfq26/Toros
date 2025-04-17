package com.example.pickleballtournament.repository;

import com.example.pickleballtournament.model.Tournament;
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
    @Query("{ 'players': ?0 }")
    List<Tournament> findByParticipantUserId(String userId);

    // (Alternatively, you could use Spring Data’s naming convention:
    // List<Tournament> findByPlayersContaining(String userId);
    // )
}
