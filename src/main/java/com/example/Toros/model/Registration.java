// src/main/java/com/example/Toros/model/Registration.java
package com.example.Toros.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

/**
 * Represents a single registration of a User (and optionally a Team) for a Tournament.
 * This class is a model for the "registrations" collection in MongoDB.
 */
@Data // Lombok annotation to generate getters, setters, toString, etc.
@Document(collection = "registrations") // Marks this class as a MongoDB document
public class Registration {

    /**
     * The unique identifier for this specific registration record.
     */
    @Id
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