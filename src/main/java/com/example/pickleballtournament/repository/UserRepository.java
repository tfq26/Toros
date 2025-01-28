package com.example.pickleballtournament.repository;

import com.example.pickleballtournament.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByUserName(String userName); // Find user by username
    //boolean existsByUserName(String userName); // Check if username already exists
}
