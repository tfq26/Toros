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

        List<String> errors = new ArrayList<>(); // Collect errors for missing or incorrect data

        for (Row row : sheet) {
            if (row.getRowNum() == 0) continue; // Skip header row

            String name = getCellValue(row.getCell(0), "name", errors, row.getRowNum());
            Integer teamNumber = getNumericCellValue(row.getCell(1), "teamNumber", errors, row.getRowNum());
            String clubName = getCellValue(row.getCell(2), "clubName", errors, row.getRowNum());
            Integer placement = getNumericCellValue(row.getCell(3), "placement", errors, row.getRowNum());

            if (name != null && teamNumber != null && clubName != null && placement != null) {
                Player player = new Player();
                player.setName(name);
                player.setTeamNumber(teamNumber);
                player.setClubName(clubName);
                player.setPlacement(placement);
                playerList.add(player);
            }
        }

        workbook.close();

        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Errors in Excel file:\n" + String.join("\n", errors));
        }

        return playerList;
    }

    private String getCellValue(Cell cell, String fieldName, List<String> errors, int rowNum) {
        try {
            if (cell == null || cell.getCellType() != CellType.STRING) {
                errors.add("Row " + (rowNum + 1) + ": Missing or invalid value for " + fieldName);
                return null;
            }
            return cell.getStringCellValue();
        } catch (Exception e) {
            errors.add("Row " + (rowNum + 1) + ": Error reading " + fieldName + ": " + e.getMessage());
            return null;
        }
    }

    private Integer getNumericCellValue(Cell cell, String fieldName, List<String> errors, int rowNum) {
        try {
            if (cell == null || cell.getCellType() != CellType.NUMERIC) {
                errors.add("Row " + (rowNum + 1) + ": Missing or invalid value for " + fieldName);
                return null;
            }
            return (int) cell.getNumericCellValue();
        } catch (Exception e) {
            errors.add("Row " + (rowNum + 1) + ": Error reading " + fieldName + ": " + e.getMessage());
            return null;
        }
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
