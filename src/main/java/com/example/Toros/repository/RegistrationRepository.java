package com.example.Toros.repository;

import com.example.Toros.model.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

/**
 * Spring Data MongoDB repository for the Registration entity.
 */
public interface RegistrationRepository extends MongoRepository<Registration, String> {

    /**
     * Finds all registrations associated with a specific user ID.
     * Spring Data automatically creates the database query based on the method name.
     * It will look for documents in the 'registration' collection where the 'userId' field matches the provided parameter.
     *
     * @param userId The unique identifier of the user.
     * @return A list of Registration objects for the given user.
     */
    List<Registration> findByUserId(String userId);

}