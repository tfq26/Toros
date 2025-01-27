package com.example.pickleballtournament.repository;

import com.example.pickleballtournament.model.Team;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends MongoRepository<Team, String> {
    Team findByTeamName(String teamName); // Query by teamName
    boolean existsByTeamName(String teamName); // Check existence by teamName
}
