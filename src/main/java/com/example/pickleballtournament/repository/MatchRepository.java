package com.example.pickleballtournament.repository;

import com.example.pickleballtournament.model.Match;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends MongoRepository<Match, String> {

    // Find matches where the team ID matches either team1 or team2
    @Query("{ '$or': [ { 'team1.id': ?0 }, { 'team2.id': ?0 } ] }")
    List<Match> findByTeamId(String teamId);

    // Alternative method using Spring Data naming convention
    List<Match> findByTeam1_IdOrTeam2_Id(String teamId1, String teamId2);
}
