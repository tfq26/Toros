package com.example.Toros.repository;

import com.example.Toros.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    // ✅ Add this line to support lookup by Auth0 ID
    Optional<User> findByAuth0Id(String auth0Id);
}
