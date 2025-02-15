package com.example.pickleballtournament.repository;

import com.example.pickleballtournament.model.Tournament;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TournamentRepository extends MongoRepository<Tournament, String> {

    /** ✅ Get the currently active tournament */
    Optional<Tournament> findByIsActive(boolean isActive);

    /** ✅ Find a tournament by name */
    Optional<Tournament> findByName(String name);

    /** ✅ Get all completed tournaments */
    List<Tournament> findByIsActiveFalse();

    /** ✅ Find a tournament by status (LIVE, COMPLETED, UPCOMING) */
    Optional<Tournament> findByStatus(String status);

}
