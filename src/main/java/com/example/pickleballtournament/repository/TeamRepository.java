package com.example.pickleballtournament.repository;

import com.example.pickleballtournament.model.Team;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface TeamRepository extends MongoRepository<Team, String> {
    Team findByName(String name);
    boolean existsByName(String name);
}
