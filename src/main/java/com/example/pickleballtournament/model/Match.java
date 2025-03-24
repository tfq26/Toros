package com.example.pickleballtournament.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
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
    private LocalTime startTime; // Start time of the match
    private LocalTime endTime;   // End time of the match
    private String winner; // Winner of the match
    private String loser;  // Loser of the match
    private int round; //Round Number
    private String nextMatchId; // Reference to the next match in the bracket
    private String matchSkillLevel;

    // Custom ID generator
    public void generateCustomId() {
        this.id = "MATCH-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }
}
