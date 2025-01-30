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

import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TournamentService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamService teamService;

    public TournamentService(MatchRepository matchRepository, TeamRepository teamRepository, TournamentRepository tournamentRepository, TeamService teamService) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.tournamentRepository = tournamentRepository;
        this.teamService = teamService;
    }

    /** ✅ Setup the Tournament */
    @Transactional
    public void setupTournament(int numCourts, int gamesPerTeam, boolean useExistingPlayers, boolean tiered, LocalTime startTime, int matchDuration) {
        log.info("Initializing tournament setup...");

        matchRepository.deleteAll();
        teamRepository.deleteAll();
        log.info("Cleared all existing matches and teams.");

        List<Team> teams = setupAndGenerateTeams();
        if (teams.isEmpty()) {
            throw new IllegalStateException("No teams available for the tournament.");
        }

        List<Match> matches = generateMatches(teams, numCourts, gamesPerTeam, tiered, startTime, matchDuration);
        matchRepository.saveAll(matches);
        log.info("Saved {} matches.", matches.size());
    }

    private List<Match> generateMatches(List<Team> teams, int numCourts, int gamesPerTeam, boolean tiered, LocalTime startTime, int matchDuration) {
        log.info("Generating matches for {} teams with {} courts.", teams.size(), numCourts);

        if (teams.size() < 2) {
            throw new IllegalStateException("Not enough teams to generate matches.");
        }

        List<Match> matches = new ArrayList<>();
        Map<Integer, List<Team>> groupedTeams;

        // **1️⃣ Group teams based on tiers if tiered play is enabled**
        if (tiered) {
            groupedTeams = teams.stream()
                    .collect(Collectors.groupingBy(team -> team.getPlacement() != null ? team.getPlacement() : 0)); // Default placement for null
        } else {
            groupedTeams = new HashMap<>();
            groupedTeams.put(0, teams); // All teams in one group
        }

        AtomicInteger courtNumber = new AtomicInteger(1);
        Map<Integer, LocalTime> courtTimes = new HashMap<>();
        for (int i = 1; i <= numCourts; i++) {
            courtTimes.put(i, startTime);
        }

        // **2️⃣ Generate matches for each tier/group**
        for (List<Team> group : groupedTeams.values()) {
            Collections.shuffle(group); // Shuffle teams for fairness

            for (int i = 0; i < group.size(); i++) {
                for (int j = i + 1; j < group.size(); j++) {
                    if (matches.size() >= gamesPerTeam * teams.size() / 2) {
                        break; // Stop once we've reached the required number of games per team
                    }

                    Team team1 = group.get(i);
                    Team team2 = group.get(j);

                    // **3️⃣ Assign court and schedule times**
                    int assignedCourt = courtNumber.get();
                    LocalTime matchStartTime = courtTimes.get(assignedCourt);
                    LocalTime matchEndTime = matchStartTime.plusMinutes(matchDuration);

                    // **4️⃣ Create match**
                    Match match = new Match();
                    match.setTeam1(team1);
                    match.setTeam2(team2);
                    match.setTeam1Score(0);
                    match.setTeam2Score(0);
                    match.setStatus("Scheduled");
                    match.setCourtNumber(assignedCourt);
                    match.setStartTime(matchStartTime);
                    match.setEndTime(matchEndTime);
                    match.generateCustomId();

                    matches.add(match);

                    // **5️⃣ Update court schedules**
                    courtTimes.put(assignedCourt, matchEndTime);
                    courtNumber.set((courtNumber.get() % numCourts) + 1); // Rotate courts
                }
            }
        }

        log.info("Generated {} matches.", matches.size());
        return matches;
    }


    /** ✅ Generate Teams */
    @Transactional
    public List<Team> setupAndGenerateTeams() {
        log.info("Generating teams...");
        teamRepository.deleteAll();

        List<Team> teams = teamService.generateTeams();
        teamRepository.saveAll(teams);
        log.info("Successfully saved {} teams.", teams.size());

        return teams;
    }

    /** ✅ Retrieve All Matches */
    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    /** ✅ Update Match Results */
    @Transactional
    public void updateMatchStatus(String matchId, int team1Score, int team2Score, String status) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        match.setTeam1Score(team1Score);
        match.setTeam2Score(team2Score);
        match.setStatus(status);

        if ("Complete".equalsIgnoreCase(status)) {
            Team team1 = match.getTeam1();
            Team team2 = match.getTeam2();

            if (team1Score > team2Score) {
                match.setWinner(team1.getTeamName());
                team1.incrementWins();
                team2.incrementLosses();
            } else {
                match.setWinner(team2.getTeamName());
                team2.incrementWins();
                team1.incrementLosses();
            }

            teamRepository.save(team1);
            teamRepository.save(team2);
        }

        matchRepository.save(match);
    }

    /** ✅ End Tournament */
    @Transactional
    public void endTournament() {
        Optional<Tournament> liveTournament = tournamentRepository.findByStatus("LIVE");
        liveTournament.ifPresent(tournament -> {
            tournament.setStatus("COMPLETED");
            tournamentRepository.save(tournament);
            log.info("Tournament {} marked as COMPLETED.", tournament.getName());
        });
    }

    /** ✅ Clear All Matches */
    @Transactional
    public void clearAllMatches() {
        matchRepository.deleteAll();
        log.info("All matches have been cleared from the database.");
    }

    /** ✅ Get Team Standings */
    public List<Team> getStandings() {
        List<Team> teams = teamRepository.findAll();
        return teams.stream()
                .sorted(Comparator.comparingInt(Team::getWins).reversed()
                        .thenComparingInt(Team::getLosses))
                .collect(Collectors.toList());
    }

    /** ✅ Get Matches by Team ID */
    public List<Match> getMatchesByTeam(String teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new IllegalArgumentException("Team not found with ID: " + teamId);
        }
        return matchRepository.findByTeam1_IdOrTeam2_Id(teamId, teamId);
    }

    /** ✅ Get Matches by Team Name */
    public List<Match> getMatchesByTeamName(String teamName) {
        List<Team> teams = teamRepository.findAllByTeamName(teamName);
        List<String> teamIds = teams.stream().map(Team::getId).collect(Collectors.toList());

        List<Match> matches = new ArrayList<>();
        for (String teamId : teamIds) {
            matches.addAll(matchRepository.findByTeam1_IdOrTeam2_Id(teamId, teamId));
        }
        return matches;
    }

    /** ✅ Create Knockout Matches */
    @Transactional
    public void createKnockoutMatches(List<Team> teams) {
        if (teams.size() < 2) throw new IllegalArgumentException("Not enough teams for knockout.");

        Queue<Match> queue = new LinkedList<>();
        for (int i = 0; i < teams.size(); i += 2) {
            Match match = new Match();
            match.setTeam1(teams.get(i));
            match.setTeam2(i + 1 < teams.size() ? teams.get(i + 1) : null);
            match.setStatus("Scheduled");
            matchRepository.save(match);
            queue.add(match);
        }

        while (queue.size() > 1) {
            List<Match> currentRound = new ArrayList<>();
            while (!queue.isEmpty()) {
                Match match1 = queue.poll();
                Match match2 = queue.poll();
                Match nextMatch = new Match();
                nextMatch.setStatus("Scheduled");

                match1.setNextMatchId(nextMatch.getId());
                if (match2 != null) match2.setNextMatchId(nextMatch.getId());

                currentRound.add(nextMatch);
                matchRepository.save(match1);
                if (match2 != null) matchRepository.save(match2);
            }
            queue.addAll(currentRound);
        }
    }

    /** ✅ Advance a Winner in Knockout Matches */
    @Transactional
    public void advanceWinner(String matchId, String winnerTeamId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        Match nextMatch = matchRepository.findById(match.getNextMatchId())
                .orElseThrow(() -> new IllegalArgumentException("Next match not found."));

        if (nextMatch.getTeam1() == null) {
            nextMatch.setTeam1(teamRepository.findById(winnerTeamId).orElseThrow());
        } else {
            nextMatch.setTeam2(teamRepository.findById(winnerTeamId).orElseThrow());
        }

        matchRepository.save(nextMatch);
    }
}
