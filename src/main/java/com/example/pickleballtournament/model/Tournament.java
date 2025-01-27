package com.example.pickleballtournament.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
@Getter
@Setter

@Document(collection = "tournaments")
public class Tournament {
    @Id
    private String id;
    private String name;
    private String status; // LIVE, COMPLETED
    private List<Match> matches;
    private List<Team> teams;

}
