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
    // Remove Lombok-generated setter for skillLevel so we can provide a custom one.
    @Setter(AccessLevel.NONE)
    private int skillLevel; // Skill level as an integer (1-3)
    private Integer placement; // Placement in the tournament
    private int totalPoints; // Tracks total points won by the team
    private String tournamentId; // Reference to the tournament the team is registered in
    private String status; // e.g., "Registered", "Checked In", "Withdrawn", "Player 1 Withdrawn", "Player 2 Withdrawn", "Player 1 Checked In", "Player 2 Checked In", "Player 1 Not Registered", "Player 2 Not Registered"
    private String matchId; // Reference to the match the team is currently playing in
    private String matchStatus; // e.g., "Scheduled", "In Progress", "Completed"

    // Default constructor
    public Team() {}

    // Constructor with parameters and null safety checks
    public Team(String name, Player player1, Player player2) {
        this.name = name;
        this.player1 = player1;
        this.player2 = player2;
        this.teamScore = 0;
        this.wins = 0;
        this.losses = 0;
        this.matchesPlayed = 0;
        this.totalPoints = 0;
        // Use safe values for players' skill levels: default to 0 if null
        int p1Skill = (player1 != null && player1.getSkillLevel() != null) ? player1.getSkillLevel() : 0;
        int p2Skill = (player2 != null && player2.getSkillLevel() != null) ? player2.getSkillLevel() : 0;
        this.skillLevel = calculateSkillLevel(p1Skill, p2Skill);
    }

    /**
     * Calculate skill level as an integer based on players' skill levels.
     * Returns 1 for Beginner, 2 for Intermediate, 3 for Advanced.
     */
    private int calculateSkillLevel(int player1Skill, int player2Skill) {
        double averageSkill = (player1Skill + player2Skill) / 2.0;
        if (averageSkill <= 1.5) {
            return 1; // Beginner
        } else if (averageSkill <= 2.5) {
            return 2; // Intermediate
        } else {
            return 3; // Advanced
        }
    }

    /**
     * Custom setter for skillLevel that can accept either an Integer or a String.
     * If a string is provided, it converts "Beginner" to 1, "Intermediate" to 2, and "Advanced" to 3.
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
        updateSkillLevel();
    }

    /**
     * Increment the team's loss count and update matches played.
     */
    public void incrementLosses() {
        this.losses++;
        this.matchesPlayed++;
    }

    /**
     * Update the team's skill level dynamically based on performance.
     * For example, if wins >= 8, set to Advanced (3); if wins >= 4, set to Intermediate (2); otherwise, Beginner (1).
     */
    private void updateSkillLevel() {
        if (wins >= 8) {
            this.skillLevel = 3; // Advanced
        } else if (wins >= 4) {
            this.skillLevel = 2; // Intermediate
        } else {
            this.skillLevel = 1; // Beginner
        }
    }

    /**
     * Safely set players and update the skill level.
     */
    public void setPlayers(Player player1, Player player2) {
        this.player1 = player1;
        this.player2 = player2;
        int p1Skill = (player1 != null && player1.getSkillLevel() != null) ? player1.getSkillLevel() : 0;
        int p2Skill = (player2 != null && player2.getSkillLevel() != null) ? player2.getSkillLevel() : 0;
        this.skillLevel = calculateSkillLevel(p1Skill, p2Skill);
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
