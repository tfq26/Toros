package com.example.pickleballtournament.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Document(collection = "tournaments")
@Data
public class Tournament {

    @Id
    private String id;
    private String name;
    private LocalDate dateHeld;
    private boolean isActive; // Indicates if the tournament is still ongoing
    private String status; // "LIVE", "COMPLETED", "UPCOMING"
    private int numCourts;
    private int gamesPerTeam;
    private boolean tiered;

    // ✅ Store setup properties as a List<String> or Map<String, Object>
    private List<String> setupProperties; // Example: ["Match Duration: 15min", "Double Elimination: true"]
    // OR
    private Map<String, Object> setupPropertiesMap; // If you prefer key-value pairs


    private List<String> teams; // Stores teams playing in the tournament


    private List<String> matches; // Matches played within the tournament

    private List<String> finalPlacements; // Final ranking after tournament completion

    // ✅ Helper Method to check if tournament is live
    public boolean isLive() {
        return "LIVE".equalsIgnoreCase(status);
    }
}
