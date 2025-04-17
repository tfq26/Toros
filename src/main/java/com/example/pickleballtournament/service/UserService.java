package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.Player;
import com.example.pickleballtournament.model.User;
import com.example.pickleballtournament.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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

    public User getOrCreateByJwt(Jwt jwt) {
        String auth0Id = jwt.getSubject();

        return userRepository.findByAuth0Id(auth0Id).orElseGet(() -> {
            log.debug("🔐 Creating new user from JWT (sub={}):", auth0Id);

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(jwt.getTokenValue());
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            String userInfoEndpoint = issuerUri + "/userinfo";
            ResponseEntity<Map> response = restTemplate.exchange(
                    userInfoEndpoint,
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            Map<String, Object> userInfo = response.getBody();

            User newUser = new User();
            newUser.setAuth0Id(auth0Id);
            newUser.setRole("USER");
            newUser.setEnabled(true);

            newUser.setUsername((String) userInfo.getOrDefault("nickname", ""));
            newUser.setFirstName((String) userInfo.getOrDefault("given_name", ""));
            newUser.setLastName((String) userInfo.getOrDefault("family_name", ""));
            newUser.setEmail((String) userInfo.getOrDefault("email", ""));
            newUser.setPicture((String) userInfo.getOrDefault("picture", ""));
            newUser.setPhone((String) userInfo.getOrDefault("phone_number", ""));

            Player player = new Player();
            newUser.setPlayerProfile(player);

            return userRepository.save(newUser);
        });
    }

    public Optional<User> findByAuth0Id(String auth0Id) {
        return userRepository.findByAuth0Id(auth0Id);
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
