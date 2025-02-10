package com.example.pickleballtournament.config;

import com.example.pickleballtournament.repository.UserRepository;
import com.example.pickleballtournament.security.JwtAuthenticationFilter;
import com.example.pickleballtournament.utility.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Value("${spring.profiles.active:prod}") // Default to "prod" if not set
    private String activeProfile;

    public SecurityConfig(JwtUtil jwtUtil, UserRepository userRepository) { // ✅ Correct constructor injection
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        logger.info("SecurityConfig - Active Profile: {}", activeProfile);

        if ("dev".equals(activeProfile)) {
            logger.info("Running in DEV mode - Allowing all requests.");
            http.csrf(csrf -> csrf.disable())
                    .authorizeHttpRequests(auth -> auth
                            .anyRequest().permitAll()
                    );
        } else {
            logger.info("Running in PROD mode - Enforcing authentication.");
            http.csrf(csrf -> csrf.disable())
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers("/auth/**").permitAll()
                            .requestMatchers("/api/tournament/**").authenticated()
                            .requestMatchers("/api/bracket/**").authenticated()
                            .requestMatchers("/api/players/**").authenticated()
                            .anyRequest().authenticated()
                    )
                    .sessionManagement(session -> session
                            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    )
                    .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        }

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil, userRepository);
    }
}
