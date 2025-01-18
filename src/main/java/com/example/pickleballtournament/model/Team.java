package com.example.pickleballtournament.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "teams")
public class Team {
    @Id
    private String id;
    private String name;
    private int wins;
    private int losses;
    private int matchesPlayed;
    private int score;
    private Integer placement; // New field for placement (e.g., "Beginner", "Intermediate", "Advanced")
    private Player player1;
    private Player player2;

    // Constructors
    public Team() {}

    public Team(String name) {
        this.name = name;
        this.wins = 0;
        this.losses = 0;
        this.matchesPlayed = 0;
        this.score = 0;
        this.placement = 0; // Default placement
        this.player1 = null;
        this.player2 = null;
    }

    public Team(String id, String name, int matchesPlayed, int wins, int losses, int placement) {
        this.id = id;
        this.name = name;
        this.matchesPlayed = matchesPlayed;
        this.wins = wins;
        this.losses = losses;
        this.score = 0;
        this.placement = placement;
        this.player1 = null;
        this.player2 = null;
    }

    public void setPlayers(Player player1, Player player2) {
        this.player1 = player1;
        this.player2 = player2;
    }

    private int calculateTeamPlacement(int player1Placement, int player2Placement) {
        // Step 1: Calculate the average placement
        double averagePlacement = (player1Placement + player2Placement) / 2.0;

        // Step 2: Adjust for imbalance
        double adjustmentFactor = 0.0;
        if (Math.abs(player1Placement - player2Placement) > 1) {
            adjustmentFactor = 0.5 * (player2Placement - player1Placement);
        }
        double finalPlacement = averagePlacement - adjustmentFactor;

        // Step 3: Clamp the result to the range [1, 3] and round
        return (int) Math.max(1, Math.min(3, Math.round(finalPlacement)));
    }

    public void getTeamPlacement() {
        this.placement = calculateTeamPlacement(player1.getPlacement(), player2.getPlacement());
    }

    // Methods
    public void incrementWins() {
        this.wins++;
        updatePlacement(); // Update placement on wins
    }

    public void incrementLosses() {
        this.losses++;
        updatePlacement(); // Update placement on losses
    }

    public void incrementMatchesPlayed() {
        this.matchesPlayed++;
    }

    /**
     * Update placement based on performance.
     * For example:
     * - 0-3 wins: Beginner
     * - 4-7 wins: Intermediate
     * - 8+ wins: Advanced
     */
    public void updatePlacement() {
        if (wins >= 8) {
            this.placement = 3;
        } else if (wins >= 4) {
            this.placement = 2;
        } else {
            this.placement = 1;
        }
    }

    @Override
    public String toString() {
        return "Team{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", matchesPlayed=" + matchesPlayed +
                ", wins=" + wins +
                ", losses=" + losses +
                ", placement='" + placement + '\'' +
                '}';
    }
}
