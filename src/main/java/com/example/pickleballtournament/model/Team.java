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

    private String name; // ✅ Fixed field name
    private Player player1;
    private Player player2;
    private int teamScore;
    private int wins;
    private int losses;
    private int matchesPlayed;
    private String skillLevel; // e.g., "Beginner", "Intermediate", "Advanced"
    private Integer placement;

    // ✅ Constructor with null safety checks
    public Team() {}

    public Team(String name, Player player1, Player player2) {
        this.name = name; // ✅ Fixed field name
        this.player1 = player1;
        this.player2 = player2;
        this.teamScore = 0;
        this.wins = 0;
        this.losses = 0;
        this.matchesPlayed = 0;
        this.skillLevel = calculateSkillLevel(
                player1 != null ? player1.getPlacement() : 0,
                player2 != null ? player2.getPlacement() : 0
        );
    }

    /**
     * ✅ Calculate skill level based on player placements.
     */
    private String calculateSkillLevel(int player1Placement, int player2Placement) {
        double averagePlacement = (player1Placement + player2Placement) / 2.0;
        if (averagePlacement <= 1.5) {
            return "Beginner";
        } else if (averagePlacement <= 2.5) {
            return "Intermediate";
        } else {
            return "Advanced";
        }
    }

    /**
     * ✅ Increment team's win count and update skill level.
     */
    public void incrementWins() {
        this.wins++;
        this.matchesPlayed++;
        updateSkillLevel();
    }

    /**
     * ✅ Increment team's loss count.
     */
    public void incrementLosses() {
        this.losses++;
        this.matchesPlayed++;
    }

    /**
     * ✅ Update the team's skill level dynamically based on performance.
     */
    private void updateSkillLevel() {
        if (wins >= 8) {
            this.skillLevel = "Advanced";
        } else if (wins >= 4) {
            this.skillLevel = "Intermediate";
        } else {
            this.skillLevel = "Beginner";
        }
    }

    /**
     * ✅ Ensure players are set safely, avoiding NullPointerException.
     */
    public void setPlayers(Player player1, Player player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.skillLevel = calculateSkillLevel(
                player1 != null ? player1.getPlacement() : 0,
                player2 != null ? player2.getPlacement() : 0
        );
    }

    @Override
    public String toString() {
        return "Team{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", player1=" + (player1 != null ? player1.getName() : "N/A") +
                ", player2=" + (player2 != null ? player2.getName() : "N/A") +
                ", teamScore=" + teamScore +
                ", wins=" + wins +
                ", losses=" + losses +
                ", matchesPlayed=" + matchesPlayed +
                ", skillLevel='" + skillLevel + '\'' +
                '}';
    }
}
