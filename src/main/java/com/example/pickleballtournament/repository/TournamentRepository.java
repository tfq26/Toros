package com.example.pickleballtournament.repository;

import com.example.pickleballtournament.model.Tournament;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface TournamentRepository extends MongoRepository<Tournament, String> {

    /** ✅ Get a list of all active tournaments */
    List<Tournament> findByIsActiveTrue(); // ✅ Fix: Return List instead of Optional

    /** ✅ Get a single active tournament */
    Optional<Tournament> findByIsActive(boolean isActive);

    /** ✅ Find a tournament by name */
    Optional<Tournament> findByName(String name);
}

