package com.example.Toros.repository;

import com.example.Toros.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, String> {

    /** All teams in a given tournament */
    List<Team> findByTournamentId(String tournamentId);

    /** All teams that include this player ID in their `players` list */
    @Query("SELECT t FROM Team t JOIN t.players p WHERE p = :playerId")
    List<Team> findByPlayersContaining(String playerId);

}
