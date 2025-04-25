package com.example.Toros.repository;

import com.example.Toros.model.Player;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends MongoRepository<Player, String> {
    List<Player> findByTeamNumber(int teamNumber);
    List<Player> findByStatus(String status);
}