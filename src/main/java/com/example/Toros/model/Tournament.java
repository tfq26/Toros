package com.example.Toros.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Document(collection = "tournaments")
@Data
public class Tournament {

    @Id
    private String id;
    private String name;
    private boolean isActive; // Indicates if the tournament is still ongoing
    private String status; // "LIVE", "COMPLETED", "UPCOMING"
    private int numCourts;
    private int gamesPerTeam;
    private boolean tiered;
    private Integer breakDuration; // In minutes
    private Integer matchDuration; // In minutes
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location; // Location of the tournament
    private String organizer; // Name of the organizer
    private String contactInfo; // Contact information for the organizer
    private String tournamentType; // e.g., "Singles", "Doubles", "Mixed"
    private String scoringSystem; // e.g., "Rally Scoring", "Traditional Scoring"
    private String rules; // e.g., "USAPA Rules", "Custom Rules"
    private String prizeDistribution; // e.g., "1st: $500, 2nd: $300, 3rd: $200"
    private String format; // e.g., "Round Robin", "Single Elimination", "Double Elimination"
    private String ageGroup; // e.g., "18+", "35+", "50+"
    private String skillLevel; // e.g., "Beginner", "Intermediate", "Advanced"
    private String auth0Id; // Auth0 ID for the organizer, if applicable
    // Store setup properties as a List<String> or Map<String, Object>
    private List<String> setupProperties; // Example: ["Match Duration: 15min", "Double Elimination: true"]
    private Map<String, Object> setupPropertiesMap; // If you prefer key-value pairs

    // Now storing only IDs rather than full objects
    @DBRef
    private List<Team> teams = new ArrayList<>();
    @DBRef
    private List<Match> matches = new ArrayList<>();
    private List<String> finalPlacements; // Final ranking after tournament completion
    private List<String> players;
}