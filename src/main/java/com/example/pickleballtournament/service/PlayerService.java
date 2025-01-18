package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.Player;
import com.example.pickleballtournament.repository.PlayerRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public List<Player> importPlayersFromExcel(InputStream inputStream) throws Exception {
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);

        List<Player> players = new ArrayList<>();
        List<String> errors = new ArrayList<>(); // Collect errors for missing or incorrect data

        for (Row row : sheet) {
            if (row.getRowNum() == 0) continue; // Skip header row

            String name = getCellValue(row.getCell(0), "name", errors, row.getRowNum());
            Integer teamNumber = getNumericCellValue(row.getCell(1), "teamNumber", errors, row.getRowNum());
            String clubName = getCellValue(row.getCell(2), "clubName", errors, row.getRowNum());
            Integer placement = getNumericCellValue(row.getCell(3), "placement", errors, row.getRowNum());

            if (name != null && teamNumber != null && clubName != null && placement != null) {
                Player player = new Player();
                player.setId(generateCustomId(name, teamNumber)); // Set custom ID
                player.setName(name);
                player.setTeamNumber(teamNumber);
                player.setClubName(clubName);
                player.setPlacement(placement);
                players.add(player);
            }
        }

        workbook.close();

        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Errors in Excel file:\n" + String.join("\n", errors));
        }

        return players;
    }

    public void savePlayers(List<Player> players) {
        playerRepository.deleteAll(); // Clear the database before saving new players
        playerRepository.saveAll(players); // Save the players to MongoDB
    }

    private String generateCustomId(String name, Integer teamNumber) {
        String initials = name.chars()
                .filter(Character::isUpperCase)
                .limit(2)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();

        String randomString = RandomStringUtils.randomAlphanumeric(4).toUpperCase();
        return initials + "-" + teamNumber + "-" + randomString;
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
        return playerRepository.findAll();
    }

    public List<Player> getPlayersByTeamNumber(int teamNumber) {
        return playerRepository.findByTeamNumber(teamNumber);
    }

    public List<Integer> getAllTeamNumbers() {
        // Fetch all players and extract unique team numbers
        return playerRepository.findAll()
                .stream()
                .map(Player::getTeamNumber)
                .filter(Objects::nonNull) // Ignore null team numbers
                .distinct()
                .collect(Collectors.toList());
    }
}
