package com.example.pickleballtournament.repository;

import com.example.pickleballtournament.model.Team;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends MongoRepository<Team, String> {

    // Return a list in case multiple teams have the same name
    List<Team> findAllByTeamName(String teamName);

    // Check if a team with the given name exists
    boolean existsByTeamName(String teamName);
}
