package com.example.pickleballtournament.repository;

import com.example.pickleballtournament.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username); // Find user by username
    boolean existsByUsername(String username); // Check if username already exists
}
