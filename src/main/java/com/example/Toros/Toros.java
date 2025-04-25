package com.example.Toros;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Toros {

    public static void main(String[] args) {
        SpringApplication.run(Toros.class, args);
    }

    @Bean
    public CommandLineRunner init() {
        return args -> System.out.println("Pickleball app is running!");
    }
}

