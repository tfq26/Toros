package com.example.Toros.service;

import com.example.Toros.DTO.UserProfileDto;
import com.example.Toros.model.Player;
import com.example.Toros.model.User;
import com.example.Toros.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class UserService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    public UserService(UserRepository userRepository, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
    }

    /**
     * Lookup or create a User from the Auth0 JWT.
     * Also initializes a Player profile with basic info.
     */
    public User getOrCreateByJwt(Jwt jwt) {
        String auth0Id = jwt.getSubject();

        return userRepository.findByAuth0Id(auth0Id).orElseGet(() -> {
            log.debug("🔐 Creating new user from JWT (sub={})", auth0Id);

            // fetch userinfo from Auth0
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(jwt.getTokenValue());
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            String userInfoEndpoint = issuerUri + "/userinfo";
            ResponseEntity<Map> resp = restTemplate.exchange(
                    userInfoEndpoint, HttpMethod.GET, entity, Map.class);
            Map<String, Object> info = resp.getBody();

            // build User
            User user = new User();
            user.setAuth0Id(auth0Id);
            user.setRole("USER");
            user.setEnabled(true);
            user.setUsername((String) info.getOrDefault("nickname", ""));
            user.setFirstName((String) info.getOrDefault("given_name", ""));
            user.setLastName((String) info.getOrDefault("family_name", ""));
            user.setEmail((String) info.getOrDefault("email", ""));
            user.setPicture((String) info.getOrDefault("picture", ""));
            user.setPhone((String) info.getOrDefault("phone_number", ""));

            // initialize Player profile
            Player profile = new Player();
            // combine first+last name
            profile.setName(user.getFirstName() + " " + user.getLastName());
            profile.setEmail(user.getEmail());
            profile.setPhone(user.getPhone());
            // default skillLevel = 1 (Beginner)
            profile.setSkillLevel(1);
            // default status
            profile.setStatus("Registered");

            user.setPlayerProfile(profile);
            return userRepository.save(user);
        });
    }

    public Optional<User> findByAuth0Id(String auth0Id) {
        return userRepository.findByAuth0Id(auth0Id);
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    /**
     * Update the logged-in user's profile using the UserProfileDto.
     * Also mirrors name/phone/email/skillLevel into the Player sub-document.
     */
    public User updateUserProfile(String auth0Id, UserProfileDto dto) {
        User user = userRepository.findByAuth0Id(auth0Id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // update User fields
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setBio(dto.getBio());
        user.setPicture(dto.getPicture());

        // update Player profile
        Player profile = user.getPlayerProfile();
        if (profile == null) {
            profile = new Player();
            user.setPlayerProfile(profile);
        }
        // keep the same player ID if exists
        profile.setName(dto.getFirstName() + " " + dto.getLastName());
        profile.setEmail(dto.getEmail());
        profile.setPhone(dto.getPhone());
        // map skillLevel text to integer: Beginner=1, Intermediate=2, Advanced=3
        int level;
        switch (dto.getSkillLevel()) {
            case "Intermediate": level = 2; break;
            case "Advanced":     level = 3; break;
            default:             level = 1; break;
        }
        profile.setSkillLevel(level);

        return userRepository.save(user);
    }
}
