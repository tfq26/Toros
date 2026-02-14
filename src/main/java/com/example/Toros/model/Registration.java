// src/main/java/com/example/Toros/model/Registration.java
package com.example.Toros.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "registrations")
@Data
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * The ID of the tournament the user is registered for.
     * This links this registration back to a specific Tournament document.
     */
    private String tournamentId;

    /**
     * The internal database ID of the user who is registered.
     * This links this registration back to a specific User document.
     */
    private String userId;

    /**
     * The ID of the team the user is registered with, if applicable.
     * Can be null for singles events.
     */
    private String teamId; // Optional, can be null

    /**
     * The exact date and time when the registration was created.
     */
    private LocalDateTime registrationDate;

    // A good practice is to set the registration date upon creation.
    // You can do this in your service layer before saving.
    // For example: newRegistration.setRegistrationDate(LocalDateTime.now());
}