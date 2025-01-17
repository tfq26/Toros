package com.example.pickleballtournament.request;

public class TournamentSetupRequest {
    private int numCourts;
    private int gamesPerTeam;
    private boolean useExistingPlayers;
    private boolean tiered;

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
}
