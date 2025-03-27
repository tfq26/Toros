package com.example.pickleballtournament.service;

import com.example.pickleballtournament.model.Match;
import com.example.pickleballtournament.model.Team;
import com.example.pickleballtournament.model.Tournament;
import com.example.pickleballtournament.repository.MatchRepository;
import com.example.pickleballtournament.repository.TeamRepository;
import com.example.pickleballtournament.repository.TournamentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TournamentSetupService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamService teamService;

    public TournamentSetupService(MatchRepository matchRepository, TeamRepository teamRepository,
                                  TournamentRepository tournamentRepository, TeamService teamService) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.tournamentRepository = tournamentRepository;
        this.teamService = teamService;
    }

    /**
     * Deletes a tournament based on the provided tournament ID.
     *
     * @param tournamentId the ID of the tournament to delete.
     */
    public void deleteTournament(String tournamentId) {
        Optional<Tournament> tournamentOpt = tournamentRepository.findById(tournamentId);
        if (tournamentOpt.isPresent()) {
            tournamentRepository.delete(tournamentOpt.get());
            log.info("Tournament with ID {} has been deleted.", tournamentId);
        } else {
            throw new IllegalStateException("Tournament with ID " + tournamentId + " does not exist.");
        }
    }

    /**
     * Checks whether a tournament with the specified name already exists.
     *
     * @param tournamentName the name of the tournament to check.
     * @return true if a duplicate exists, false otherwise.
     */
    public boolean checkForDuplicateTournament(String tournamentName) {
        return tournamentRepository.findByName(tournamentName).isPresent();
    }

    /**
     * Sets up a new tournament with the given parameters.
     * <p>
     * New parameters include:
     * <ul>
     *   <li>tournamentName</li>
     *   <li>numCourts</li>
     *   <li>gamesPerTeam</li>
     *   <li>skillBased (to set tiered)</li>
     *   <li>startTime (LocalDateTime)</li>
     *   <li>matchDuration</li>
     *   <li>breakTime</li>
     *   <li>confirmDelete: if true, an existing tournament with the same name will be deleted.</li>
     * </ul>
     * If a duplicate tournament is found and deletion is not confirmed, the method aborts (returning null).
     * </p>
     *
     * @param tournamentName the tournament name.
     * @param numCourts      the number of courts available.
     * @param gamesPerTeam   the number of games each team will play.
     * @param skillBased     whether the tournament is skill-based (used to set the tiered flag).
     * @param startTime      the start time (LocalDateTime) of the tournament.
     * @param matchDuration  the duration (in minutes) of each match.
     * @param breakTime      the break time (in minutes) between matches.
     * @param confirmDelete  if true, an existing tournament with the same name will be deleted.
     * @return the newly created Tournament, or null if a duplicate exists and deletion was not confirmed.
     */
    @Transactional
    public Tournament setupTournament(String tournamentName, int numCourts, int gamesPerTeam, boolean skillBased,
                                      LocalDateTime startTime, int matchDuration, int breakTime, Boolean confirmDelete) {
        log.info("Setting up new tournament: {}", tournamentName);

        // Check for duplicate tournament by name.
        if (checkForDuplicateTournament(tournamentName)) {
            log.warn("Tournament with name '{}' already exists.", tournamentName);
            if (confirmDelete != null && confirmDelete) {
                Tournament existingTournament = tournamentRepository.findByName(tournamentName).get();
                deleteTournament(existingTournament.getId());
                log.info("Existing tournament '{}' deleted as per user confirmation.", tournamentName);
            } else {
                log.info("Duplicate tournament exists and deletion was not confirmed. Aborting setup.");
                return null; // Let the frontend handle renaming or other user choices.
            }
        }

        // Generate teams without deleting previous ones.
        List<Team> teams = teamService.generateTeams();
        if (teams.isEmpty()) {
            throw new IllegalStateException("No teams available for the tournament.");
        }

        // Create and initialize a new Tournament.
        Tournament tournament = new Tournament();
        tournament.setName(tournamentName);
        tournament.setDateHeld(startTime.toLocalDate());
        tournament.setActive(true);
        tournament.setId(generateSecureId()); // Generate a secure 12-character ID.
        tournament.setNumCourts(numCourts);
        tournament.setGamesPerTeam(gamesPerTeam);
        tournament.setTiered(skillBased); // Using 'skillBased' to set the tiered flag.
        tournament.setMatchDuration(matchDuration);
        tournament.setBreakDuration(breakTime);
        tournament.setStartTime(startTime);

        // Build setupProperties list based on user parameters.
        List<String> setupProperties = new ArrayList<>();
        setupProperties.add(tournamentName);
        setupProperties.add(String.valueOf(numCourts));
        setupProperties.add(String.valueOf(gamesPerTeam));
        setupProperties.add(String.valueOf(skillBased));
        setupProperties.add(String.valueOf(startTime));
        setupProperties.add(String.valueOf(matchDuration));
        setupProperties.add(String.valueOf(breakTime));
        tournament.setSetupProperties(setupProperties);

        // Convert team objects to team IDs.
        List<String> teamIds = teams.stream()
                .map(Team::getId)
                .collect(Collectors.toList());
        tournament.setTeams(teamIds);
        tournament.setStatus("LIVE");

        tournament = tournamentRepository.save(tournament);
        log.info("Tournament '{}' saved successfully with ID: {}", tournament.getName(), tournament.getId());

        // Generate matches (passing the breakTime parameter) and update the tournament.
        // Note: The original generateMatches method expects a LocalTime, so we convert startTime.
        List<String> matchIds = generateMatches(tournament, teams, numCourts, gamesPerTeam, skillBased,
                startTime, matchDuration, breakTime);
        tournament.setMatches(matchIds);
        tournamentRepository.save(tournament);

        return tournament;
    }

    /**
     * Generates matches for the given tournament.
     * This version includes a breakTime between matches.
     *
     * @param tournament    the tournament for which to generate matches.
     * @param teams         the list of teams participating.
     * @param numCourts     the number of courts available.
     * @param gamesPerTeam  the number of games each team should play.
     * @param tiered        whether the tournament is tiered (skill-based).
     * @param startTime     the start time (LocalTime) for the first match.
     * @param matchDuration the duration (in minutes) of each match.
     * @param breakTime     the break time (in minutes) between matches.
     * @return a list of generated match IDs.
     */
    private List<String> generateMatches(Tournament tournament, List<Team> teams, int numCourts, int gamesPerTeam,
                                        boolean tiered, LocalDateTime startTime, int matchDuration, int breakTime) {
        log.info("Generating matches for Tournament '{}' (ID: {}) | {} teams with {} courts.",
                tournament.getName(), tournament.getId(), teams.size(), numCourts);

        if (teams.size() < 2) {
            throw new IllegalStateException("Not enough teams to generate matches.");
        }

        List<Match> matches = new ArrayList<>();
        // Group teams based on tier if required; otherwise, use a single group.
        Map<Integer, List<Team>> groupedTeams = tiered
                ? teams.stream().collect(Collectors.groupingBy(team -> team.getPlacement() != null ? team.getPlacement() : 0))
                : Collections.singletonMap(0, teams);

        AtomicInteger courtNumber = new AtomicInteger(1);
        Map<Integer, LocalDateTime> courtTimes = new HashMap<>();
        for (int i = 1; i <= numCourts; i++) {
            courtTimes.put(i, startTime);
        }

        // Total matches required.
        int totalMatchesRequired = gamesPerTeam * teams.size() / 2;

        // Process each group separately.
        for (List<Team> group : groupedTeams.values()) {
            if (group.size() < 2) continue;

            // Generate all unique pairs for the current group.
            List<Team[]> pairs = new ArrayList<>();
            for (int i = 0; i < group.size(); i++) {
                for (int j = i + 1; j < group.size(); j++) {
                    pairs.add(new Team[]{group.get(i), group.get(j)});
                }
            }

            // Shuffle the pairs to ensure randomness.
            Collections.shuffle(pairs);

            for (Team[] pair : pairs) {
                if (matches.size() >= totalMatchesRequired) break;

                // Randomly swap team order to balance team1 and team2 assignments.
                if (Math.random() < 0.5) {
                    Team temp = pair[0];
                    pair[0] = pair[1];
                    pair[1] = temp;
                }

                int assignedCourt = courtNumber.get();
                LocalDateTime matchStartTime = courtTimes.get(assignedCourt);
                LocalDateTime matchEndTime = matchStartTime.plusMinutes(matchDuration);

                Match match = new Match();
                match.setId(tournament.getId());
                match.setTournament(tournament);
                match.setTeam1(pair[0]);
                match.setTeam2(pair[1]);
                match.setTeam1Score(0);
                match.setTeam2Score(0);
                match.setStatus("Scheduled");
                match.setCourtNumber(assignedCourt);
                match.setStartTime(matchStartTime);
                match.setEndTime(matchEndTime);
                match.generateCustomId();

                // Determine match skill level based on the higher skill between the two teams.
                if (pair[0].getSkillLevel() > pair[1].getSkillLevel()) {
                    match.setMatchSkillLevel(pair[0].getSkillLevelString());
                } else {
                    match.setMatchSkillLevel(pair[1].getSkillLevelString());
                }

                log.info("Match Scheduled: {} vs {} on Court {} for Tournament '{}'",
                        pair[0].getName(), pair[1].getName(), assignedCourt, tournament.getName());

                matches.add(match);
                // Update the start time for the next match on the same court (match end time + break time).
                courtTimes.put(assignedCourt, matchEndTime.plusMinutes(breakTime));
                // Rotate court number for next match.
                courtNumber.set((courtNumber.get() % numCourts) + 1);
            }
            // Break early if we've scheduled enough matches.
            if (matches.size() >= totalMatchesRequired) break;
        }

        List<Match> savedMatches = matchRepository.saveAll(matches);
        List<String> matchIds = savedMatches.stream()
                .map(Match::getId)
                .collect(Collectors.toList());

        log.info("Generated and saved {} matches for Tournament '{}'", matchIds.size(), tournament.getName());
        return matchIds;
    }

    /**
     * Helper method to generate a secure alphanumeric ID of 12 characters.
     *
     * @return a secure ID string.
     */
    private String generateSecureId() {
        return UUID.randomUUID().toString().replaceAll("-", "").substring(0, 12);
    }
}
