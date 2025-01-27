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

    private String teamName;
    private Player player1;
    private Player player2;
    private int teamScore;
    private int wins;
    private int losses;
    private int matchesPlayed;
    private String skillLevel; // e.g., "Beginner", "Intermediate", "Advanced"
    private Integer placement;

    // Constructors
    public Team() {}

    public Team(String teamName, Player player1, Player player2) {
        this.teamName = teamName;
        this.player1 = player1;
        this.player2 = player2;
        this.teamScore = 0;
        this.wins = 0;
        this.losses = 0;
        this.matchesPlayed = 0;
        this.skillLevel = calculateSkillLevel(player1.getPlacement(), player2.getPlacement());
    }

    // Methods

    /**
     * Calculate the team's skill level based on the players' placements.
     *
     * @param player1Placement The placement of the first player.
     * @param player2Placement The placement of the second player.
     * @return A string representing the team's skill level.
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
     * Get the calculated placement level based on player placements.
     *
     * @return The numerical placement level (1 = Beginner, 2 = Intermediate, 3 = Advanced).
     */
//    public int getPlacement() {
//        int player1Placement = player1 != null ? player1.getPlacement() : 0;
//        int player2Placement = player2 != null ? player2.getPlacement() : 0;
//
//        double averagePlacement = (player1Placement + player2Placement) / 2.0;
//
//        if (averagePlacement <= 1.5) {
//            return 1;
//        } else if (averagePlacement <= 2.5) {
//            return 2;
//        } else {
//            return 3;
//        }
//    }

    /**
     * Increment the team's win count and update the skill level if necessary.
     */
    public void incrementWins() {
        this.wins++;
        this.matchesPlayed++;
        updateSkillLevel();
    }

    /**
     * Increment the team's loss count.
     */
    public void incrementLosses() {
        this.losses++;
        this.matchesPlayed++;
    }

    /**
     * Update the team's skill level dynamically based on their performance.
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
     * Set players for the team and recalculate the skill level.
     *
     * @param player1 The first player.
     * @param player2 The second player.
     */
    public void setPlayers(Player player1, Player player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.skillLevel = calculateSkillLevel(player1.getPlacement(), player2.getPlacement());
    }

    @Override
    public String toString() {
        return "Team{" +
                "id='" + id + '\'' +
                ", teamName='" + teamName + '\'' +
                ", player1=" + player1 +
                ", player2=" + player2 +
                ", teamScore=" + teamScore +
                ", wins=" + wins +
                ", losses=" + losses +
                ", matchesPlayed=" + matchesPlayed +
                ", skillLevel='" + skillLevel + '\'' +
                '}';
    }
}
