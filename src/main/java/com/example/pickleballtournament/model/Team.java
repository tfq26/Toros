package com.example.pickleballtournament.model;

import lombok.Getter;
import lombok.Setter;
import lombok.AccessLevel;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "teams")
public class Team {

    @Id
    private String id; // Unique identifier for the team
    private String name; // Team name
    private Player player1; // Player 1 is mandatory
    private Player player2; // Player 2 can be null for singles
    private int teamScore; // Score of the team in the tournament
    private int wins; // Number of matches won
    private int losses; // Number of matches lost
    private int matchesPlayed; // Number of matches played
    @Setter(AccessLevel.NONE)
    private Integer skillLevel; // Skill level as an integer (1-3)
    private Integer placement; // Placement in the tournament
    private int totalPoints; // Tracks total points won by the team
    private String tournamentId; // Reference to the tournament the team is registered in
    private String status; // e.g., "Registered", "Checked In", etc.
    private String matchId; // Reference to the match the team is currently playing in
    private String matchStatus; // e.g., "Scheduled", "In Progress", "Completed"

    // Default constructor
    public Team() {
        // Optionally initialize default values
    }

    // Parameterized constructor that uses the custom setters to ensure recalculation
    public Team(String name, Player player1, Player player2) {
        this.name = name;
        this.teamScore = 0;
        this.wins = 0;
        this.losses = 0;
        this.matchesPlayed = 0;
        this.totalPoints = 0;
        setPlayer1(player1);
        setPlayer2(player2);
    }

    /**
     * Calculate skill level as an integer based on players' skill levels.
     * Returns 1 for Beginner, 2 for Intermediate, 3 for Advanced.
     */
    private int calculateSkillLevel(int player1Skill, int player2Skill) {
        double averageSkill = (player1Skill + player2Skill) / 2.0;
        if (averageSkill <= 1) {
            return 1; // Beginner
        } else if (averageSkill <= 2) {
            return 2; // Intermediate
        } else {
            return 3; // Advanced
        }
    }

    /**
     * Override setter for player1. When setting a player, recalculate the team's skill level.
     */
    public void setPlayer1(Player player1) {
        this.player1 = player1;
        recalcSkillLevel();
    }

    /**
     * Override setter for player2. When setting a player, recalculate the team's skill level.
     */
    public void setPlayer2(Player player2) {
        this.player2 = player2;
        recalcSkillLevel();
    }

    /**
     * Recalculate the team's skill level based on player1 and player2's skill levels.
     */
    private void recalcSkillLevel() {
        int p1Skill = (player1 != null && player1.getSkillLevel() != null) ? player1.getSkillLevel() : 0;
        int p2Skill = (player2 != null && player2.getSkillLevel() != null) ? player2.getSkillLevel() : 0;
        this.skillLevel = calculateSkillLevel(p1Skill, p2Skill);
    }

    /**
     * Custom setter for skillLevel that accepts either an Integer or String.
     */
    public void setSkillLevel(Object value) {
        if (value instanceof String) {
            String level = ((String) value).trim();
            if ("Beginner".equalsIgnoreCase(level)) {
                this.skillLevel = 1;
            } else if ("Intermediate".equalsIgnoreCase(level)) {
                this.skillLevel = 2;
            } else if ("Advanced".equalsIgnoreCase(level)) {
                this.skillLevel = 3;
            } else {
                this.skillLevel = 0; // default or unknown
            }
        } else if (value instanceof Number) {
            this.skillLevel = ((Number) value).intValue();
        } else {
            this.skillLevel = 0;
        }
    }

    /**
     * Returns the skill level as a string.
     * Frontend can call this method to display the skill level.
     */
    public String getSkillLevelString() {
        switch (this.skillLevel) {
            case 1:
                return "Beginner";
            case 2:
                return "Intermediate";
            case 3:
                return "Advanced";
            default:
                return "Unknown";
        }
    }

    /**
     * Increment the team's win count, update matches played and recalculate skill level.
     */
    public void incrementWins() {
        this.wins++;
        this.matchesPlayed++;
        recalcSkillLevel();
    }

    /**
     * Increment the team's loss count and update matches played.
     */
    public void incrementLosses() {
        this.losses++;
        this.matchesPlayed++;
    }

    /**
     * Safely set players and update the skill level.
     */
    public void setPlayers(Player player1, Player player2) {
        setPlayer1(player1);
        setPlayer2(player2);
    }

    /**
     * Add points to the team's total points.
     * @param pointsScored The number of points the team won in a match.
     */
    public void addPoints(int pointsScored) {
        this.totalPoints += pointsScored;
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
                ", totalPoints=" + totalPoints +
                ", skillLevel=" + getSkillLevelString() +
                '}';
    }
}
