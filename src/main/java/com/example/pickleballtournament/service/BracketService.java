package com.example.pickleballtournament.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;

@Service
public class BracketService {

    public List<String> getBracketStandings() {
        // Placeholder data - replace this with actual logic to fetch from the database
        List<String> standings = new ArrayList<>();
        standings.add("Team A");
        standings.add("Team B");
        standings.add("Team C");
        standings.add("Team D");
        return standings;
    }
}
