package com.example.pickleballtournament.request;

import java.time.LocalTime;

public class TournamentSetupRequest {
    private int numCourts;
    private int gamesPerTeam;
    private boolean useExistingPlayers;
    private boolean tiered;
    private LocalTime startTime; // New field for tournament start time
    private int matchDuration;  // New field for match duration in minutes

    // Getters and setters
    public int getNumCourts() {
        return numCourts;
    }

    public void setNumCourts(int numCourts) {
        this.numCourts = numCourts;
    }

    public int getGamesPerTeam() {
        return gamesPerTeam;
    }

    public void setGamesPerTeam(int gamesPerTeam) {
        this.gamesPerTeam = gamesPerTeam;
    }

    public boolean isUseExistingPlayers() {
        return useExistingPlayers;
    }

    public void setUseExistingPlayers(boolean useExistingPlayers) {
        this.useExistingPlayers = useExistingPlayers;
    }

    public boolean isTiered() {
        return tiered;
    }

    public void setTiered(boolean tiered) {
        this.tiered = tiered;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public int getMatchDuration() {
        return matchDuration;
    }

    public void setMatchDuration(int matchDuration) {
        this.matchDuration = matchDuration;
    }
}
