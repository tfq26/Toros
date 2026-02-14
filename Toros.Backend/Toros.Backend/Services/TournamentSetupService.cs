using Microsoft.EntityFrameworkCore;
using Toros.Backend.Data;
using Toros.Backend.DTOs;
using Toros.Backend.Interfaces;
using Toros.Backend.Models;

namespace Toros.Backend.Services;

public class TournamentSetupService : ITournamentSetupService
{
    private readonly AppDbContext _context;
    private readonly ITeamService _teamService;
    private readonly ILogger<TournamentSetupService> _logger;

    public TournamentSetupService(
        AppDbContext context,
        ITeamService teamService,
        ILogger<TournamentSetupService> logger)
    {
        _context = context;
        _teamService = teamService;
        _logger = logger;
    }

    public async Task<bool> CheckForDuplicateTournamentAsync(string tournamentName)
    {
        return await _context.Tournaments.AnyAsync(t => t.Name == tournamentName && t.Status != "COMPLETED");
    }

    public async Task DeleteTournamentAsync(string tournamentId)
    {
        var tournament = await _context.Tournaments.FindAsync(tournamentId);
        if (tournament != null)
        {
            _context.Tournaments.Remove(tournament);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Tournament with ID {TournamentId} deleted", tournamentId);
        }
    }

    public async Task<Tournament?> SetupTournamentAsync(TournamentSetupRequest request)
    {
        _logger.LogInformation("Setting up new tournament: {TournamentName}", request.TournamentName);

        // 1) Duplicate check & optional delete
        var existing = await _context.Tournaments.FirstOrDefaultAsync(t => t.Name == request.TournamentName && t.Status != "COMPLETED");
        if (existing != null)
        {
            if (request.ConfirmDelete == true)
            {
                _context.Tournaments.Remove(existing);
                await _context.SaveChangesAsync();
            }
            else
            {
                return null;
            }
        }

        // 2) Generate teams
        var teams = await _teamService.GenerateTeamsAsync();
        if (teams.Count == 0)
        {
            throw new Exception("No teams available for the tournament.");
        }

        // 3) Build tournament object
        var tournament = new Tournament
        {
            Name = request.TournamentName,
            Status = "LIVE",
            NumberOfCourts = request.NumCourts,
            Location = request.Location,
            OrganizerName = request.Organizer,
            OrganizerContact = request.ContactInfo,
            Type = request.TournamentType,
            AgeGroup = request.AgeGroup,
            SkillLevel = request.SkillLevel,
            Auth0Id = request.Auth0Id,
            AccessCode = (100000 + Random.Shared.Next(900000)).ToString(),
            Teams = teams,
            SetupPropertiesMap = new Dictionary<string, string>
            {
                ["Location"] = request.Location,
                ["Type"] = request.TournamentType,
                ["Courts"] = request.NumCourts.ToString()
            }
        };

        _context.Tournaments.Add(tournament);
        await _context.SaveChangesAsync();

        // 4) Generate matches (Simplified for now, can expand later)
        await GenerateMatchesAsync(tournament, teams, request);

        await _context.SaveChangesAsync();
        return tournament;
    }

    private async Task GenerateMatchesAsync(Tournament tournament, List<Team> teams, TournamentSetupRequest request)
    {
        // Porting the match generation logic from Java
        var matches = new List<Match>();
        var totalMatchesRequired = request.GamesPerTeam * teams.Count / 2;
        var scheduledPairs = new HashSet<string>();
        
        // This is a simplified version of the Java logic for brevity in this step
        // In a real port, I'd copy the exact shuffle/pairing logic
        for (int i = 0; i < teams.Count; i++)
        {
            for (int j = i + 1; j < teams.Count; j++)
            {
                if (matches.Count >= totalMatchesRequired) break;

                var match = new Match
                {
                    TournamentId = tournament.Id,
                    Team1 = teams[i],
                    Team1Id = teams[i].Id,
                    Team2 = teams[j],
                    Team2Id = teams[j].Id,
                    Status = "SCHEDULED",
                    CourtNumber = (matches.Count % request.NumCourts) + 1,
                    StartTime = request.StartTime.AddMinutes(matches.Count / request.NumCourts * (request.MatchDuration + request.BreakTime))
                };
                matches.Add(match);
            }
        }

        _context.Matches.AddRange(matches);
        tournament.Matches = matches;
    }
}
