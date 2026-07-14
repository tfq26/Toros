using Microsoft.EntityFrameworkCore;
using Toros.Backend.Data;
using Toros.Backend.DTOs;
using Toros.Backend.Interfaces;
using Toros.Common.Models;
using Toros.Common.Enums;

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
        return await _context.Tournaments.AnyAsync(t => t.Name == tournamentName && t.Status != TournamentStatus.Completed);
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
        var existing = await _context.Tournaments.FirstOrDefaultAsync(t => t.Name == request.TournamentName && t.Status != TournamentStatus.Completed);
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

        // 2) Build tournament object (no teams required initially)
        // Teams will be added during player registration
        var tournament = new Tournament
        {
            Name = request.TournamentName,
            Status = TournamentStatus.Open, // Changed from Ongoing to Open for registration
            NumberOfCourts = request.NumCourts,
            Location = request.Location,
            OrganizerName = request.Organizer,
            OrganizerContact = request.ContactInfo,
            AgeGroup = request.AgeGroup,
            SkillLevel = request.SkillLevel,
            Format = request.Format, // Singles, Doubles, Mixed
            Auth0Id = request.UserId ?? request.Auth0Id, // Use UserId from frontend, fallback to Auth0Id
            AccessCode = (100000 + Random.Shared.Next(900000)).ToString(),
            StartDate = request.StartTime,
            Teams = new List<Team>() // Empty list initially
        };

        _context.Tournaments.Add(tournament);
        await _context.SaveChangesAsync(); // Save to get Id

        // 3) Create Initial Stage based on request type
        Enum.TryParse<TournamentType>(request.TournamentType, true, out var tType);
        
        var stage = new TournamentStage
        {
            TournamentId = tournament.Id,
            Name = "Stage 1",
            SequenceOrder = 1,
            Type = tType,
            Status = TournamentStatus.Open
        };

        _context.TournamentStages.Add(stage);
        await _context.SaveChangesAsync();

        // 4) Auto-assign organizer as a tournament player
        if (!string.IsNullOrEmpty(tournament.Auth0Id))
        {
            var organizerPlayer = new TournamentPlayer
            {
                TournamentId = tournament.Id,
                UserId = tournament.Auth0Id
            };
            _context.TournamentPlayers.Add(organizerPlayer);
            await _context.SaveChangesAsync();
            _logger.LogInformation("✅ Organizer auto-assigned to tournament");
        }

        // 5) Matches will be generated later when teams are registered
        // For now, just return the tournament ready for registration

        _logger.LogInformation("✅ Tournament '{TournamentName}' created successfully with ID: {TournamentId}", tournament.Name, tournament.Id);
        return tournament;
    }

    private async Task GenerateMatchesAsync(Tournament tournament, TournamentStage stage, List<Team> teams, TournamentSetupRequest request)
    {
        // Porting the match generation logic from Java
        var matches = new List<Match>();
        var totalMatchesRequired = request.GamesPerTeam * teams.Count / 2;
        
        for (int i = 0; i < teams.Count; i++)
        {
            for (int j = i + 1; j < teams.Count; j++)
            {
                // Simple limit for demo purposes
                if (matches.Count >= totalMatchesRequired && totalMatchesRequired > 0) break;

                var match = new Match
                {
                    TournamentId = tournament.Id,
                    StageId = stage.Id, // Link to Stage
                    Team1 = teams[i],
                    Team1Id = teams[i].Id,
                    Team2 = teams[j],
                    Team2Id = teams[j].Id,
                    Status = MatchStatus.Pending,
                    CourtNumber = ((matches.Count % request.NumCourts) + 1).ToString(),
                    StartTime = request.StartTime.AddMinutes(matches.Count / request.NumCourts * (request.MatchDuration + request.BreakTime))
                };
                matches.Add(match);
            }
        }

        _context.Matches.AddRange(matches);
        tournament.Matches.AddRange(matches);
    }
}
