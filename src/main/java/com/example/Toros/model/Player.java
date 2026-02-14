package com.example.Toros.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id; // Unique identifier for the player
    private String name; // Name of the player
    private int age; // Age of the player
    private String email; // Email address
    private String phone; // Contact number
    private Integer teamNumber; // Team number the player is assigned to
    private String clubName; // Name of the club the player belongs to
    private Integer skillLevel; // e.g., 1-5 scale
    private String tournamentId; // Reference to the tournament the player is registered in
    private String status; // e.g., "Registered", "Checked In", "Withdrawn"
}
