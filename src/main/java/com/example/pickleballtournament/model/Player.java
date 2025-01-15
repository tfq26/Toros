package com.example.pickleballtournament.model;

public class Player {
    private int id;
    private String name;
    private int teamNumber;
    private String clubName;
    private int placement;

    public Player(int id, String name, int teamNumber, String clubName, int placement) {
        this.id = id;
        this.name = name;
        this.teamNumber = teamNumber;
        this.clubName = clubName;
        this.placement = placement;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getTeamNumber() {
        return teamNumber;
    }

    public String getClubName() {
        return clubName;
    }

    public int getPlacement() {
        return placement;
    }

    public String getSkillLevel() {
        switch (placement) {
            case 1:
                return "Beginner";
            case 2:
                return "Intermediate";
            case 3:
                return "Advanced";
            default:
                return "Unknown";
        }
    }
}