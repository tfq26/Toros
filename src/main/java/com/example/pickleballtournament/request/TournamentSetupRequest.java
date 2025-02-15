package com.example.pickleballtournament.request;

import lombok.Data;

import java.time.LocalTime;

@Data
public class TournamentSetupRequest {
    private String tournamentName;
    private int numCourts;
    private int gamesPerTeam;
    private boolean useExistingPlayers;
    private boolean tiered;
    private LocalTime startTime;
    private int matchDuration;
}
