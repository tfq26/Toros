package com.example.pickleballtournament.service;
import com.example.pickleballtournament.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.example.pickleballtournament.model.User;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Optional<User> findByAuth0Id(String auth0Id) {
        return userRepository.findByUsername(auth0Id); // assuming you mapped Auth0 "sub" to username
    }
}
