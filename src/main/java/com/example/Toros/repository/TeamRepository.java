package com.example.Toros.repository;

import com.example.Toros.model.Team;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TeamRepository extends MongoRepository<Team, String> {

    /** All teams in a given tournament */
    List<Team> findByTournamentId(String tournamentId);

    /** All teams that include this player ID in their `players` list */
    List<Team> findByPlayersContaining(String playerId);

}
