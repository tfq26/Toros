package com.example.Toros.service;

import com.example.Toros.model.Match;
import com.example.Toros.model.Team;
import com.example.Toros.model.Tournament;
import com.example.Toros.repository.MatchRepository;
import com.example.Toros.repository.PlayerRepository;
import com.example.Toros.repository.TeamRepository;
import com.example.Toros.repository.TournamentRepository;
import com.example.Toros.request.TournamentSetupRequest; // ✨ NEW: Assuming this import
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TournamentSetupService {

    private final MatchRepository matchRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamService teamService;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;

    public TournamentSetupService(MatchRepository matchRepository,
                                  TournamentRepository tournamentRepository,
                                  TeamRepository teamRepository,
                                  PlayerRepository playerRepository,
                                  TeamService teamService) {
        this.matchRepository = matchRepository;
        this.tournamentRepository = tournamentRepository;
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
        this.teamService = teamService;
    }

    public void deleteTournament(String tournamentId) {
        Optional<Tournament> tournamentOpt = tournamentRepository.findById(tournamentId);
        if (tournamentOpt.isPresent()) {
            tournamentRepository.delete(tournamentOpt.get());
            log.info("Tournament with ID {} has been deleted.", tournamentId);
        } else {
            throw new IllegalStateException("Tournament with ID " + tournamentId + " does not exist.");
        }
    }

    public boolean checkForDuplicateTournament(String tournamentName) {
        return tournamentRepository.findByNameAndIsActiveTrue(tournamentName).isPresent();
    }

    /**
     * Sets up a new tournament using a single request object.
     *
     * @param request The object containing all setup parameters from the frontend.
     * @return the newly created Tournament, or null if a duplicate exists and deletion was not confirmed.
     */
    @Transactional
    public Tournament setupTournament(TournamentSetupRequest request) {
        log.info("Setting up new tournament: {}", request.getTournamentName());

        // 1) Duplicate check & optional delete
        if (tournamentRepository.findByNameAndIsActiveTrue(request.getTournamentName()).isPresent()) {
            log.warn("Tournament '{}' exists already.", request.getTournamentName());
            if (Boolean.TRUE.equals(request.getConfirmDelete())) {
                tournamentRepository.findByNameAndIsActiveTrue(request.getTournamentName())
                        .ifPresent(t -> {
                            tournamentRepository.deleteById(t.getId());
                            log.info("Deleted existing tournament '{}'", request.getTournamentName());
                        });
            } else {
                log.info("Aborting: duplicate found & not confirmed for delete.");
                return null;
            }
        }

        // 2) Generate teams
        List<Team> teams = teamService.generateTeams();
        if (teams.isEmpty()) {
            throw new IllegalStateException("No teams available for the tournament.");
        }

        // 3) Build tournament object from the request
        Tournament tournament = new Tournament();
        tournament.setId(generateSecureId());
        tournament.setName(request.getTournamentName());
        tournament.setActive(true);
        tournament.setStatus("LIVE");
        tournament.setNumCourts(request.getNumCourts());
        tournament.setGamesPerTeam(request.getGamesPerTeam());
        // ✨ FIXED: Changed to use the correct getter method from your request class.
        tournament.setTiered(request.isSkillBased());
        tournament.setMatchDuration(request.getMatchDuration());
        tournament.setBreakDuration(request.getBreakTime());
        // ✨ FIXED: Changed to use the correct getter method from your request class.
        tournament.setStartTime(request.getStartTime());
        tournament.setLocation(request.getLocation());
        tournament.setOrganizer(request.getOrganizer());
        tournament.setContactInfo(request.getContactInfo());
        tournament.setTournamentType(request.getTournamentType());
        tournament.setScoringSystem(request.getScoringSystem());
        tournament.setRules(request.getRules());
        tournament.setPrizeDistribution(request.getPrizeDistribution());
        tournament.setFormat(request.getFormat());
        tournament.setAgeGroup(request.getAgeGroup());
        tournament.setSkillLevel(request.getSkillLevel());
        tournament.setFinalPlacements(new ArrayList<>());

        // 4) Setup properties map & list
        Map<String,Object> propsMap = new LinkedHashMap<>();
        propsMap.put("Tournament Name",    request.getTournamentName());
        propsMap.put("Number of Courts",   request.getNumCourts());
        propsMap.put("Games Per Team",     request.getGamesPerTeam());
        // ✨ FIXED: Changed to use the correct getter method from your request class.
        propsMap.put("Tiered",             request.isSkillBased());
        // ✨ FIXED: Changed to use the correct getter method from your request class.
        propsMap.put("Start Time",         request.getStartTime());
        propsMap.put("Match Duration",     request.getMatchDuration());
        propsMap.put("Break Duration",     request.getBreakTime());
        propsMap.put("Location",           request.getLocation());
        propsMap.put("Organizer",          request.getOrganizer());
        propsMap.put("Contact Info",       request.getContactInfo());
        propsMap.put("Tournament Type",    request.getTournamentType());
        propsMap.put("Scoring System",     request.getScoringSystem());
        propsMap.put("Rules",              request.getRules());
        propsMap.put("Prize Distribution", request.getPrizeDistribution());
        propsMap.put("Format",             request.getFormat());
        propsMap.put("Age Group",          request.getAgeGroup());
        propsMap.put("Skill Level",        request.getSkillLevel());

        tournament.setSetupProperties(
                propsMap.entrySet()
                        .stream()
                        .map(e -> e.getKey() + ": " + e.getValue())
                        .collect(Collectors.toList())
        );
        tournament.setSetupPropertiesMap(propsMap);

        // ... The rest of the logic remains the same ...
        // 5) Persist teams & collect their IDs
        List<String> teamIds = teams.stream()
                .map(Team::getId)
                .collect(Collectors.toList());
        tournament.setTeams(teamIds);

        // 6) First save (to obtain tournament ID)
        tournament = tournamentRepository.save(tournament);
        log.info("Tournament '{}' saved [ID={}]", tournament.getName(), tournament.getId());

        // 7) Load each Team from DB to gather its player IDs
        List<Team> persistedTeams = teamRepository.findAllById(teamIds);
        Set<String> playerIds = new HashSet<>();
        for (Team t : persistedTeams) {
            if (t.getPlayers() != null) {
                playerIds.addAll(t.getPlayers());
            }
        }

        // 8) Validate that each player actually exists
        List<String> validPlayerIds = playerIds.stream()
                .filter(playerRepository::existsById)
                .collect(Collectors.toList());
        tournament.setPlayers(validPlayerIds);

        // 9) Generate matches and assign
        MatchGenerationResult result = generateMatches(
                tournament, teams, request.getNumCourts(), request.getGamesPerTeam(), request.isSkillBased(),
                request.getStartTime(), request.getMatchDuration(), request.getBreakTime()
        );
        tournament.setMatches(result.matchIds);
        tournament.setEndTime(result.maxEndTime);

        // 10) Final save (persists players, matches, endTime)
        tournament = tournamentRepository.save(tournament);
        log.info("Tournament '{}' now has {} teams, {} players, {} matches",
                tournament.getName(),
                teamIds.size(),
                validPlayerIds.size(),
                result.matchIds.size());

        return tournament;
    }

    private MatchGenerationResult generateMatches(Tournament tournament, List<Team> teams, int numCourts, int gamesPerTeam,
                                                  boolean tiered, LocalDateTime startTime, int matchDuration, int breakTime) {
        // This method's logic does not need to change
        log.info("Generating matches for Tournament '{}' (ID: {}) | {} teams with {} courts.",
                tournament.getName(), tournament.getId(), teams.size(), numCourts);

        if (teams.size() < 2) {
            throw new IllegalStateException("Not enough teams to generate matches.");
        }

        if (gamesPerTeam > teams.size() - 1) {
            throw new IllegalArgumentException("gamesPerTeam exceeds the maximum number of unique matches per team.");
        }
        List<Match> matches = new ArrayList<>();
        Map<Integer, List<Team>> groupedTeams = tiered
                ? teams.stream().collect(Collectors.groupingBy(team -> team.getPlacement() != null ? team.getPlacement() : 0))
                : Collections.singletonMap(0, teams);

        AtomicInteger courtNumber = new AtomicInteger(1);
        Map<Integer, LocalDateTime> courtTimes = new HashMap<>();
        for (int i = 1; i <= numCourts; i++) {
            courtTimes.put(i, startTime);
        }
        int totalMatchesRequired = gamesPerTeam * teams.size() / 2;
        Set<String> scheduledPairs = new HashSet<>();
        for (List<Team> group : groupedTeams.values()) {
            if (group.size() < 2) continue;
            List<Team[]> pairs = new ArrayList<>();
            for (int i = 0; i < group.size(); i++) {
                for (int j = i + 1; j < group.size(); j++) {
                    pairs.add(new Team[]{group.get(i), group.get(j)});
                }
            }
            Collections.shuffle(pairs);
            for (Team[] pair : pairs) {
                if (matches.size() >= totalMatchesRequired) break;
                String pairKey = generatePairKey(pair[0], pair[1]);
                if (scheduledPairs.contains(pairKey)) {
                    continue;
                }
                scheduledPairs.add(pairKey);
                if (Math.random() < 0.5) {
                    Team temp = pair[0];
                    pair[0] = pair[1];
                    pair[1] = temp;
                }
                int assignedCourt = courtNumber.get();
                LocalDateTime matchStartTime = courtTimes.get(assignedCourt);
                LocalDateTime matchEndTime = matchStartTime.plusMinutes(matchDuration);
                Match match = new Match();
                match.setId(generateSecureId());
                match.setTournamentId(tournament.getId());
                match.setTeam1(pair[0]);
                match.setTeam2(pair[1]);
                match.setTeam1Score(0);
                match.setTeam2Score(0);
                match.setStatus("Scheduled");
                match.setCourtNumber(assignedCourt);
                match.setStartTime(matchStartTime);
                match.setEndTime(matchEndTime);
                if (pair[0].getSkillLevel() > pair[1].getSkillLevel()) {
                    match.setMatchSkillLevel(pair[0].getSkillLevelString());
                } else {
                    match.setMatchSkillLevel(pair[1].getSkillLevelString());
                }
                match.setMatchFormat(tournament.getFormat());
                match.setMatchType(tournament.getTournamentType());
                matches.add(match);
                courtTimes.put(assignedCourt, matchEndTime.plusMinutes(breakTime));
                courtNumber.set((courtNumber.get() % numCourts) + 1);
            }
            if (matches.size() >= totalMatchesRequired) break;
        }

        List<Match> savedMatches = matchRepository.saveAll(matches);
        List<String> matchIds = savedMatches.stream()
                .map(Match::getId)
                .collect(Collectors.toList());
        LocalDateTime maxEndTime = savedMatches.stream()
                .map(Match::getEndTime)
                .max(LocalDateTime::compareTo)
                .orElse(startTime);
        MatchGenerationResult result = new MatchGenerationResult();
        result.matchIds = matchIds;
        result.maxEndTime = maxEndTime;
        return result;
    }

    private String generatePairKey(Team team1, Team team2) {
        String id1 = team1.getId();
        String id2 = team2.getId();
        return id1.compareTo(id2) < 0 ? id1 + "_" + id2 : id2 + "_" + id1;
    }

    private String generateSecureId() {
        return UUID.randomUUID().toString().replaceAll("-", "").substring(0, 12);
    }

    private static class MatchGenerationResult {
        List<String> matchIds;
        LocalDateTime maxEndTime;
    }
}
