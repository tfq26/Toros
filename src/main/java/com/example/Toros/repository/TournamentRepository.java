package com.example.Toros.repository;

import com.example.Toros.model.Tournament;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TournamentRepository extends MongoRepository<Tournament, String> {

    // Fetches a SINGLE tournament and populates all related data.
    @Aggregation(pipeline = {
            "{ '$match': { '_id': ?0 } }",
            "{ '$lookup': { 'from': 'teams', 'localField': 'teams', 'foreignField': '_id', 'as': 'teams' } }",
            "{ '$lookup': { 'from': 'matches', 'localField': 'matches', 'foreignField': '_id', 'as': 'matches' } }",
            // ✨ FIX: Add this stage to populate the players array
            "{ '$lookup': { 'from': 'players', 'localField': 'players', 'foreignField': '_id', 'as': 'players' } }"
    })
    Optional<Tournament> findAndPopulateById(String tournamentId);

    // Fetches ALL tournaments and populates all related data.
    @Aggregation(pipeline = {
            "{ '$lookup': { 'from': 'teams', 'localField': 'teams', 'foreignField': '_id', 'as': 'teams' } }",
            "{ '$lookup': { 'from': 'matches', 'localField': 'matches', 'foreignField': '_id', 'as': 'matches' } }",
            // ✨ FIX: Add this stage to populate the players array
            "{ '$lookup': { 'from': 'players', 'localField': 'players', 'foreignField': '_id', 'as': 'players' } }"
    })
    List<Tournament> findAllAndPopulate();

    // Fetches tournaments for a specific organizer and populates all related data.
    @Aggregation(pipeline = {
            "{ '$match': { 'auth0Id': ?0 } }",
            "{ '$lookup': { 'from': 'teams', 'localField': 'teams', 'foreignField': '_id', 'as': 'teams' } }",
            "{ '$lookup': { 'from': 'matches', 'localField': 'matches', 'foreignField': '_id', 'as': 'matches' } }",
            // ✨ FIX: Add this stage to populate the players array
            "{ '$lookup': { 'from': 'players', 'localField': 'players', 'foreignField': '_id', 'as': 'players' } }"
    })
    List<Tournament> findByAuth0IdAndPopulate(String auth0Id);

    // ✨ Also adding the populated version for your DevToolsController to use
    @Aggregation(pipeline = {
            "{ '$match': { 'isActive': true } }",
            "{ '$lookup': { 'from': 'teams', 'localField': 'teams', 'foreignField': '_id', 'as': 'teams' } }",
            "{ '$lookup': { 'from': 'matches', 'localField': 'matches', 'foreignField': '_id', 'as': 'matches' } }",
            "{ '$lookup': { 'from': 'players', 'localField': 'players', 'foreignField': '_id', 'as': 'players' } }"
    })
    List<Tournament> findActiveAndPopulate();

    // Other simple queries that do not need population can remain as they are.
    List<Tournament> findByStatus(String status);
    List<Tournament> findByPlayersContaining(String userId);
    Optional<Tournament> findByNameAndIsActiveTrue(String name);
}