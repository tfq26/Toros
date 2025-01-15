package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.Player;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class PlayerService {

    private final List<Player> playerList = new ArrayList<>();

    public List<Player> importPlayersFromExcel(InputStream inputStream) throws Exception {
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);
        playerList.clear(); // Clear existing list to avoid duplicates on new import

        int idCounter = 1; // Track unique ID for each player

        for (Row row : sheet) {
            if (row.getRowNum() == 0) continue; // Skip header row
            String name = row.getCell(0).getStringCellValue();
            int teamNumber = (int) row.getCell(1).getNumericCellValue();
            String clubName = row.getCell(2).getStringCellValue();
            int placement = (int) row.getCell(3).getNumericCellValue();
            Player player = new Player(idCounter++, name, teamNumber, clubName, placement);
            playerList.add(player);
        }

        workbook.close();
        return playerList;
    }

    public List<Player> getAllPlayers() {
        return playerList;
    }

    public List<Player> getPlayersByTeamNumber(int teamNumber) {
        List<Player> filteredList = new ArrayList<>();
        for (Player player : playerList) {
            if (player.getTeamNumber() == teamNumber) {
                filteredList.add(player);
            }
        }
        return filteredList;
    }
}


