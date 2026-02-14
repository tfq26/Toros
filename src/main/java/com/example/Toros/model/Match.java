package com.example.Toros.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Data
public class Match {
    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    // private Tournament tournament;
    private String tournamentId; // Reference to the tournament
    private int courtNumber;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "team1_id")
    private Team team1;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "team2_id")
    private Team team2;

    private int team1Score;
    private int team2Score;
    private String status; // e.g., "Scheduled", "In Progress", "Completed"
    private LocalDateTime startTime; // Start time of the match
    private LocalDateTime endTime; // End time of the match
    private String winner; // Winner of the match
    private String loser; // Loser of the match
    private int round; // Round Number
    private String nextMatchId; // Reference to the next match in the bracket
    private String matchSkillLevel; // Skill level of the match (e.g., "Beginner", "Intermediate", "Advanced")
    private String matchType; // Type of match (e.g., "Singles", "Doubles")
    private String matchFormat; // Format of the match (e.g., "Best of 3", "Best of 5")
    private String matchScoringSystem; // Scoring system used in the match (e.g., "Rally Scoring", "Traditional
                                       // Scoring")
    private String matchRules; // Rules applied in the match (e.g., "USAPA Rules", "Custom Rules")

}
