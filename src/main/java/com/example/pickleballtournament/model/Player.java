package com.example.pickleballtournament.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Document(collection = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {

    @Id
    private String id;
    private String name;
    private int age;
    private String email;
    private String phone;
    private Integer teamNumber;
    private String clubName;
    private Integer placement;
    private boolean registered;
}
