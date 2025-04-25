package com.example.Toros.request;

import lombok.Data;

@Data
public class AdvanceWinnerRequest {
    private String matchId;
    private String winnerTeamId;
}
