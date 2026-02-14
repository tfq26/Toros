package com.example.Toros.repository;

import com.example.Toros.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, String> {
    List<Player> findByTeamNumber(int teamNumber);

    List<Player> findByStatus(String status);
}