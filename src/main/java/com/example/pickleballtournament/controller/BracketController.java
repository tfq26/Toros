package com.example.pickleballtournament.controller;

import com.example.pickleballtournament.service.BracketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bracket")
@CrossOrigin(origins = "http://localhost:3000") // Adjust this based on your frontend domain
public class BracketController {

    private final BracketService bracketService;

    public BracketController(BracketService bracketService) {
        this.bracketService = bracketService;
    }

    @GetMapping
    public ResponseEntity<List<String>> getBracket() {
        List<String> standings = bracketService.getBracketStandings();
        return ResponseEntity.ok(standings);
    }
}
