using Toros.Common.Enums;
using Microsoft.EntityFrameworkCore;
using Toros.Backend.Data;
using Toros.Backend.Interfaces;
using Toros.Common.Models;

namespace Toros.Backend.Services;

public class TournamentService : ITournamentService
{
    private readonly AppDbContext _context;
    // ...
    // keeping fields same
    private readonly ITeamService _teamService;
    private readonly ILogger<TournamentService> _logger;

    public TournamentService(
        AppDbContext context,
        ITeamService teamService,
        ILogger<TournamentService> logger)
    {
        _context = context;
        _teamService = teamService;
        _logger = logger;
    }

    public async Task<List<Tournament>> GetAllTournamentsAsync()
    {
        return await _context.Tournaments
            .Include(t => t.Teams)
                .ThenInclude(team => team.Player1)
            .Include(t => t.Teams)
                .ThenInclude(team => team.Player2)
            .Include(t => t.Matches)
                .ThenInclude(m => m.Team1)
            .Include(t => t.Matches)
                .ThenInclude(m => m.Team2)
            .Include(t => t.Players)
            .ToListAsync();
    }

    public async Task<List<Tournament>> FindTournamentsByOrganizerIdAsync(string auth0Id)
    {
        return await _context.Tournaments
            .Where(t => t.Auth0Id == auth0Id)
            .Include(t => t.Teams)
            .Include(t => t.Matches)
            .ToListAsync();
    }

    public async Task<List<Tournament>> GetTournamentsByStatusAsync(TournamentStatus status)
    {
        return await _context.Tournaments
            .Where(t => t.Status == status)
            .ToListAsync();
    }

    public async Task<Tournament?> GetTournamentByIdAsync(string tournamentId)
    {
        return await _context.Tournaments
            .Include(t => t.Teams)
                .ThenInclude(team => team.Player1)
            .Include(t => t.Teams)
                .ThenInclude(team => team.Player2)
            .Include(t => t.Matches)
                .ThenInclude(m => m.Team1)
            .Include(t => t.Matches)
                .ThenInclude(m => m.Team2)
            .Include(t => t.Players)
            .FirstOrDefaultAsync(t => t.Id == tournamentId);
    }

    public async Task<Team> AddTeamToTournamentAsync(string tournamentId, Team newTeam)
    {
        var tournament = await _context.Tournaments.FindAsync(tournamentId);
        if (tournament == null) throw new Exception("Tournament not found");

        var createdTeam = await _teamService.CreateTeamAsync(newTeam);
        createdTeam.TournamentId = tournamentId;
        
        tournament.Teams.Add(createdTeam);
        await _context.SaveChangesAsync();
        return createdTeam;
    }

    public async Task EndTournamentAsync(string tournamentId)
    {
        var tournament = await _context.Tournaments.FindAsync(tournamentId);
        if (tournament == null) throw new Exception("Tournament not found");

        tournament.Status = TournamentStatus.Completed;
        await _context.SaveChangesAsync();
    }

    public async Task<Tournament> RegisterPlayerAsync(string tournamentId, string userId)
    {
        var tournament = await _context.Tournaments
            .Include(t => t.Players)
            .FirstOrDefaultAsync(t => t.Id == tournamentId);

        if (tournament == null) throw new Exception("Tournament not found");

        if (tournament.Players.Any(p => p.UserId == userId))
            throw new Exception("User already registered");

        // Fetch User to get display name? Or just link
        var user = await _context.Users.FindAsync(userId);
        var displayName = user?.Name ?? "Unknown";

        var player = new TournamentPlayer
        {
            TournamentId = tournamentId,
            UserId = userId,
            DisplayName = displayName,
            RegisteredAt = DateTime.UtcNow
        };

        _context.TournamentPlayers.Add(player);
        await _context.SaveChangesAsync();
        
        return tournament;
    }

    public async Task<List<Tournament>> GetTournamentsForUserAsync(string userId)
    {
        // For backwards compatibility or "All My Data" view
        var organized = await GetOrganizedTournamentsAsync(userId);
        var joined = await GetJoinedTournamentsAsync(userId);
        return organized.UnionBy(joined, t => t.Id).ToList();
    }

    public async Task<List<Tournament>> GetOrganizedTournamentsAsync(string userId)
    {
        return await _context.Tournaments
            .Where(t => t.Auth0Id == userId)
            .Include(t => t.Teams)
            .Include(t => t.Matches)
            .Include(t => t.Players)
            .ToListAsync();
    }

    public async Task<List<Tournament>> GetJoinedTournamentsAsync(string userId)
    {
        var tournamentIds = await _context.TournamentPlayers
            .Where(tp => tp.UserId == userId)
            .Select(tp => tp.TournamentId)
            .ToListAsync();

        return await _context.Tournaments
            .Where(t => tournamentIds.Contains(t.Id))
            .Include(t => t.Teams)
            .Include(t => t.Matches)
            .Include(t => t.Players)
            .ToListAsync();
    }

    // Player Management Methods
    public async Task<bool> IsPlayerRegisteredAsync(string tournamentId, string userId)
    {
        return await _context.TournamentPlayers
            .AnyAsync(tp => tp.TournamentId == tournamentId && tp.UserId == userId);
    }

    public async Task<TournamentPlayer> AddPlayerToTournamentAsync(string tournamentId, string userId, string? displayName = null)
    {
        var tournamentPlayer = new TournamentPlayer
        {
            TournamentId = tournamentId,
            UserId = userId,
            DisplayName = displayName ?? string.Empty,
            RegisteredAt = DateTime.UtcNow
        };

        _context.TournamentPlayers.Add(tournamentPlayer);
        await _context.SaveChangesAsync();

        return tournamentPlayer;
    }
}
