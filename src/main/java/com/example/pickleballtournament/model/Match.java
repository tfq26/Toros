package com.example.pickleballtournament.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Setter
@Getter
@Document(collection = "matches")
public class Match {
    // Getters and Setters
    @Id
    private String id;
    private Tournament tournament;
    private int courtNumber;
    private Team team1;
    private Team team2;
    private int team1Score;
    private int team2Score;
    private String status; // e.g., "Scheduled", "In Progress", "Completed"
    private LocalDateTime startTime; // Start time of the match
    private LocalDateTime endTime;   // End time of the match
    private String winner; // Winner of the match
    private String loser;  // Loser of the match
    private int round; //Round Number
    private String nextMatchId; // Reference to the next match in the bracket
    private String matchSkillLevel; // Skill level of the match (e.g., "Beginner", "Intermediate", "Advanced")
    private String matchType; // Type of match (e.g., "Singles", "Doubles")
    private String matchFormat; // Format of the match (e.g., "Best of 3", "Best of 5")
    private String matchScoringSystem; // Scoring system used in the match (e.g., "Rally Scoring", "Traditional Scoring")
    private String matchRules; // Rules applied in the match (e.g., "USAPA Rules", "Custom Rules")


    // Custom ID generator
    public void generateCustomId() {
        this.id = "MATCH-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }
}
