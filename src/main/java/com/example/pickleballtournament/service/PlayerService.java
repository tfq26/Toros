package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.Player;
import com.example.pickleballtournament.repository.PlayerRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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

    /**
     * Imports players from an Excel file.
     *
     * @param inputStream the input stream of the Excel file
     * @return a list of players parsed from the file
     * @throws Exception if an error occurs during import
     */
    private List<Player> importPlayersFromExcel(InputStream inputStream) throws Exception {
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);

        List<Player> players = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (Row row : sheet) {
            if (row.getRowNum() == 0) continue; // Skip header row

            String name = getCellValue(row.getCell(0), "name", errors, row.getRowNum());
            Integer age = getNumericCellValue(row.getCell(1), "age", errors, row.getRowNum());
            String email = getCellValue(row.getCell(2), "email", errors, row.getRowNum());
            String phone = getCellValue(row.getCell(3), "phone", errors, row.getRowNum());
            Integer teamNumber = getNumericCellValue(row.getCell(4), "teamNumber", errors, row.getRowNum());
            String clubName = getCellValue(row.getCell(5), "clubName", errors, row.getRowNum());
            Integer placement = getNumericCellValue(row.getCell(6), "placement", errors, row.getRowNum());

            // Ensure all required fields are available before adding to the list
            if (name != null && age != null && email != null && phone != null &&
                    teamNumber != null && clubName != null && placement != null) {

                Player player = new Player();
                player.setId(generateCustomId(name, teamNumber));
                player.setName(name);
                player.setAge(age);
                player.setEmail(email);
                player.setPhone(phone);
                player.setTeamNumber(teamNumber);
                player.setClubName(clubName);
                player.setSkillLevel(placement);
                player.setStatus("Registered"); // Default status
                players.add(player);
            }
        }

        workbook.close();

        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Errors in Excel file:\n" + String.join("\n", errors));
        }

        return players;
    }

    /**
     * Combines importing players from an Excel file and saving them to the database.
     * It deletes all existing players before saving the newly imported ones.
     *
     * @param inputStream the input stream of the Excel file
     * @return the list of players saved to the database
     * @throws Exception if an error occurs during import or save
     */
    public List<Player> importAndSavePlayers(InputStream inputStream) throws Exception {
        List<Player> players = importPlayersFromExcel(inputStream);
        // Clear existing players and save new ones
        playerRepository.deleteAll();
        return playerRepository.saveAll(players);
    }

    public Player createPlayer(Player player) {
        return playerRepository.save(player);
    }

    public Player updatePlayer(String id, Player updatedPlayer) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + id));
        player.setName(updatedPlayer.getName());
        player.setAge(updatedPlayer.getAge());
        player.setEmail(updatedPlayer.getEmail());
        player.setPhone(updatedPlayer.getPhone());
        player.setTeamNumber(updatedPlayer.getTeamNumber());
        player.setClubName(updatedPlayer.getClubName());
        player.setSkillLevel(updatedPlayer.getSkillLevel());
        player.setStatus(updatedPlayer.getStatus());
        return playerRepository.save(player);
    }

    public void deletePlayer(String id) {
        playerRepository.deleteById(id);
    }

    public Player getPlayerById(String id) {
        return playerRepository.findById(id).orElse(null);
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public List<Player> getPlayersByTeamNumber(int teamNumber) {
        return playerRepository.findByTeamNumber(teamNumber);
    }

    public List<Player> getPlayerByStatus(String status) {
        return playerRepository.findByStatus(status);
    }

    public List<Integer> getAllTeamNumbers() {
        return playerRepository.findAll()
                .stream()
                .map(Player::getTeamNumber)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
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
            if (cell == null || cell.getCellType() == CellType.BLANK) {
                errors.add("Row " + (rowNum + 1) + ": Missing value for " + fieldName);
                return null;
            }
            return cell.getCellType() == CellType.STRING
                    ? cell.getStringCellValue()
                    : String.valueOf(cell.getNumericCellValue());
        } catch (Exception e) {
            errors.add("Row " + (rowNum + 1) + ": Error reading " + fieldName + ": " + e.getMessage());
            return null;
        }
    }

    private Integer getNumericCellValue(Cell cell, String fieldName, List<String> errors, int rowNum) {
        try {
            if (cell == null || cell.getCellType() == CellType.BLANK) {
                errors.add("Row " + (rowNum + 1) + ": Missing value for " + fieldName);
                return null;
            }
            if (cell.getCellType() == CellType.NUMERIC) {
                return (int) cell.getNumericCellValue();
            } else if (cell.getCellType() == CellType.STRING) {
                return Integer.parseInt(cell.getStringCellValue().trim());
            } else {
                errors.add("Row " + (rowNum + 1) + ": Invalid value for " + fieldName);
                return null;
            }
        } catch (Exception e) {
            errors.add("Row " + (rowNum + 1) + ": Error reading " + fieldName + ": " + e.getMessage());
            return null;
        }
    }
}
