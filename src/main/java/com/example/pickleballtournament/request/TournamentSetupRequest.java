package com.example.pickleballtournament.request;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TournamentSetupRequest {
    private String tournamentName;
    private int numCourts;
    private int gamesPerTeam;
    private LocalDateTime startTime;
    private int matchDuration;
    private int breakTime;
    private boolean skillBased;
    private Boolean confirmDelete;
}
