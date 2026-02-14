package com.example.Toros.repository;

import com.example.Toros.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, String> {

        // Fetches a SINGLE tournament and populates all related data.
        @Query("SELECT t FROM Tournament t LEFT JOIN FETCH t.teams LEFT JOIN FETCH t.matches WHERE t.id = :tournamentId")
        Optional<Tournament> findAndPopulateById(String tournamentId);

        // Fetches ALL tournaments and populates all related data.
        @Query("SELECT DISTINCT t FROM Tournament t LEFT JOIN FETCH t.teams LEFT JOIN FETCH t.matches")
        List<Tournament> findAllAndPopulate();

        // Fetches tournaments for a specific organizer and populates all related data.
        @Query("SELECT DISTINCT t FROM Tournament t LEFT JOIN FETCH t.teams LEFT JOIN FETCH t.matches WHERE t.auth0Id = :auth0Id")
        List<Tournament> findByAuth0IdAndPopulate(String auth0Id);

        // ✨ Also adding the populated version for your DevToolsController to use
        @Query("SELECT DISTINCT t FROM Tournament t LEFT JOIN FETCH t.teams LEFT JOIN FETCH t.matches WHERE t.isActive = true")
        List<Tournament> findActiveAndPopulate();

        // Other simple queries that do not need population can remain as they are.
        List<Tournament> findByStatus(String status);

        @Query("SELECT t FROM Tournament t JOIN t.players p WHERE p = :userId")
        List<Tournament> findByPlayersContaining(String userId);

        Optional<Tournament> findByNameAndIsActiveTrue(String name);
}