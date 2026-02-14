package com.example.Toros.repository;

import com.example.Toros.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, String> {

    // Find matches where the team ID matches either team1 or team2
    @Query("SELECT m FROM Match m WHERE m.team1.id = :teamId OR m.team2.id = :teamId")
    List<Match> findByTeamId(String teamId);

    // Alternative method using Spring Data naming convention
    List<Match> findByTeam1_IdOrTeam2_Id(String teamId1, String teamId2);

    // Find matches by tournament ID
    List<Match> findByTournamentId(String tournamentId);
}
