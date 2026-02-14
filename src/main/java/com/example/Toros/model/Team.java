package com.example.Toros.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.AccessLevel;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;

    // Mandatory first player
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "player1_id")
    private Player player1;

    // Optional second player
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "player2_id")
    private Player player2;

    private int teamScore;
    private int wins;
    private int losses;
    private int matchesPlayed;
    private int totalPoints;

    private String tournamentId;
    private String status; // e.g. "Registered", "Checked In"
    private String matchId; // current match
    private String matchStatus; // e.g. "Scheduled", "In Progress"

    @Setter(AccessLevel.NONE)
    private Integer skillLevel; // 1=Beginner,2=Intermediate,3=Advanced

    @ElementCollection
    @CollectionTable(name = "team_player_ids", joinColumns = @JoinColumn(name = "team_id"))
    @Column(name = "player_id")
    private List<String> players = new ArrayList<>();

    private Integer placement;

    // --- Constructors ---

    public Team() {
        // nothing yet—players list will be empty until you set player1/2
    }

    public Team(String name, Player player1, Player player2, String tournamentId) {
        this.name = name;
        setPlayer1(player1);
        setPlayer2(player2);
        this.tournamentId = tournamentId;
        this.teamScore = 0;
        this.totalPoints = 0;
        this.wins = 0;
        this.losses = 0;
        this.matchesPlayed = 0;
    }

    // Full constructor: calls our setters so skillLevel & players are correct
    public Team(String name,
            Player player1,
            Player player2,
            String tournamentId,
            String status,
            String matchId,
            String matchStatus,
            Integer placement,
            Object skillLevel,
            int teamScore,
            int totalPoints,
            int wins,
            int losses,
            int matchesPlayed) {

        this.name = name;
        this.teamScore = teamScore;
        this.totalPoints = totalPoints;
        this.wins = wins;
        this.losses = losses;
        this.matchesPlayed = matchesPlayed;

        setPlayer1(player1);
        setPlayer2(player2);

        this.tournamentId = tournamentId;
        this.status = status;
        this.matchId = matchId;
        this.matchStatus = matchStatus;
        this.placement = placement;
        setSkillLevel(skillLevel);
    }

    // --- Player setters override to recalc skill & update players list ---

    public void setPlayer1(Player p) {
        this.player1 = p;
        recalcSkillLevel();
        updatePlayersList();
    }

    public void setPlayer2(Player p) {
        this.player2 = p;
        recalcSkillLevel();
        updatePlayersList();
    }

    /**
     * Bulk-set both players in one call.
     */
    public void setPlayers(Player p1, Player p2) {
        this.player1 = p1;
        this.player2 = p2;
        recalcSkillLevel();
        updatePlayersList();
    }

    /**
     * Rebuilds `players` from player1/player2.
     */
    private void updatePlayersList() {
        List<String> ids = new ArrayList<>();
        if (player1 != null && player1.getId() != null)
            ids.add(player1.getId());
        if (player2 != null && player2.getId() != null)
            ids.add(player2.getId());
        this.players = ids;
    }

    // --- Skill level logic ---

    private void recalcSkillLevel() {
        int s1 = (player1 != null && player1.getSkillLevel() != null)
                ? player1.getSkillLevel()
                : 0;
        int s2 = (player2 != null && player2.getSkillLevel() != null)
                ? player2.getSkillLevel()
                : 0;
        this.skillLevel = calculateSkillLevel(s1, s2);
    }

    private int calculateSkillLevel(int p1, int p2) {
        double avg = (p1 + p2) / 2.0;
        if (avg <= 1)
            return 1;
        if (avg <= 2)
            return 2;
        return 3;
    }

    /**
     * Accepts either a String ("Beginner", etc.) or Number.
     */
    public void setSkillLevel(Object value) {
        if (value instanceof String) {
            switch (((String) value).toLowerCase()) {
                case "beginner" -> this.skillLevel = 1;
                case "intermediate" -> this.skillLevel = 2;
                case "advanced" -> this.skillLevel = 3;
                default -> this.skillLevel = 0;
            }
        } else if (value instanceof Number) {
            this.skillLevel = ((Number) value).intValue();
        } else {
            this.skillLevel = 0;
        }
    }

    public String getSkillLevelString() {
        return switch (this.skillLevel) {
            case 1 -> "Beginner";
            case 2 -> "Intermediate";
            case 3 -> "Advanced";
            default -> "Unknown";
        };
    }

    // --- Convenience methods ---

    public void incrementWins() {
        this.wins++;
        this.matchesPlayed++;
        recalcSkillLevel();
    }

    public void incrementLosses() {
        this.losses++;
        this.matchesPlayed++;
    }

    public void addPoints(int pts) {
        this.totalPoints += pts;
    }

    @Override
    public String toString() {
        return "Team{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", players=" + players +
                ", skillLevel=" + getSkillLevelString() +
                ", wins=" + wins +
                ", losses=" + losses +
                '}';
    }
}
