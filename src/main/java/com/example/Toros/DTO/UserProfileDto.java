package com.example.Toros.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Data Transfer Object for User Profile.
 * This class is used to transfer user profile data between the client and server.
 */
@Data
public class UserProfileDto {

    @NotBlank(message = "First name must not be blank")
    private String firstName;

    @NotBlank(message = "Last name must not be blank")
    private String lastName;

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email should be valid")
    private String email;

    // optional field: allow blank
    private String phone;

    @Size(max = 500, message = "Bio must not exceed 500 characters")
    private String bio;

    @NotBlank(message = "Skill level must not be blank")
    private String skillLevel;

    // getters + setters omitted for brevity
}
