package com.example.pickleballtournament.request;

import java.time.LocalTime;

public class TournamentSetupRequest {
    private String tournamentName;
    private int numCourts;
    private int gamesPerTeam;
    private boolean useExistingPlayers;
    private boolean tiered;
    private LocalTime startTime;
    private int matchDuration;

    // ✅ Add Getters
    public String getTournamentName() {
        return tournamentName;
    }

    public int getNumCourts() {
        return numCourts;
    }

    public int getGamesPerTeam() {
        return gamesPerTeam;
    }

    public boolean isUseExistingPlayers() {
        return useExistingPlayers;
    }

    public boolean isTiered() {
        return tiered;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public int getMatchDuration() {
        return matchDuration;
    }
}
