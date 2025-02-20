package com.example.pickleballtournament.repository;

import com.example.pickleballtournament.model.Team;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TeamRepository extends MongoRepository<Team, String> {

    // ✅ Correct field name
    List<Team> findAllByName(String name);

    // ✅ Optional: Find teams using player names
    List<Team> findByPlayer1_NameOrPlayer2_Name(String player1Name, String player2Name);
}
