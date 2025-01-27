package com.example.pickleballtournament.repository;

import com.example.pickleballtournament.model.Tournament;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TournamentRepository extends MongoRepository<Tournament, String> {
    Optional<Tournament> findByStatus(String status); // For retrieving live tournaments
}
