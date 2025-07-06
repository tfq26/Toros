package com.example.Toros.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TournamentSetupRequest {
    // Basic tournament parameters
    private String tournamentName;
    private int numCourts;
    private int gamesPerTeam;
    private boolean skillBased;
    private LocalDateTime startTime;
    private int matchDuration;
    private int breakTime;
    private Boolean confirmDelete;
    @JsonProperty("auth0UserId")
    private String auth0Id; // Auth0 ID of the organizer

    // Extended tournament properties
    private String location;
    private String organizer;
    private String contactInfo;
    private String tournamentType;
    private String scoringSystem;
    private String rules;
    private String prizeDistribution;
    private String format;
    private String ageGroup;
    private String skillLevel;
}
