package com.example.Toros.repository;

import com.example.Toros.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, String> {

    /**
     * Finds all registrations associated with a specific user ID.
     * Spring Data automatically creates the database query based on the method
     * name.
     * It will look for documents in the 'registration' collection where the
     * 'userId' field matches the provided parameter.
     *
     * @param userId The unique identifier of the user.
     * @return A list of Registration objects for the given user.
     */
    List<Registration> findByUserId(String userId);

}