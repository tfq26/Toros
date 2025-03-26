package com.example.pickleballtournament.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private Integer breakDuration; // In minutes
    private Integer matchDuration; // In minutes
    private LocalDateTime startTime;

    // Store setup properties as a List<String> or Map<String, Object>
    private List<String> setupProperties; // Example: ["Match Duration: 15min", "Double Elimination: true"]
    private Map<String, Object> setupPropertiesMap; // If you prefer key-value pairs

    // Now storing only IDs rather than full objects
    private List<String> teams; // Stores team IDs
    private List<String> matches; // Stores match IDs
    private List<String> finalPlacements; // Final ranking after tournament completion

    // Helper method to check if tournament is live
    public boolean isLive() {
        return "LIVE".equalsIgnoreCase(status);
    }
}
