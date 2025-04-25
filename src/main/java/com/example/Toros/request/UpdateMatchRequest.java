package com.example.Toros.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateMatchRequest {
    private int team1Score;
    private int team2Score;
    private String status;

}
