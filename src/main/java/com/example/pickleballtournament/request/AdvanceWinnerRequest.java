package com.example.pickleballtournament.request;

import lombok.Data;

@Data
public class AdvanceWinnerRequest {
    private String matchId;
    private String winnerTeamId;
}
