using Microsoft.EntityFrameworkCore;
using Toros.Backend.Data;
using Toros.Backend.Interfaces;
using Toros.Backend.Models;

namespace Toros.Backend.Services;

public class TournamentService : ITournamentService
{
    private readonly AppDbContext _context;
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
            .Include(t => t.Matches)
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

    public async Task<List<Tournament>> GetTournamentsByStatusAsync(string status)
    {
        return await _context.Tournaments
            .Where(t => t.Status == status)
            .ToListAsync();
    }

    public async Task<Tournament?> GetTournamentByIdAsync(string tournamentId)
    {
        return await _context.Tournaments
            .Include(t => t.Teams)
            .Include(t => t.Matches)
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

        tournament.Status = "COMPLETED";
        await _context.SaveChangesAsync();
    }

    public async Task<Tournament> RegisterPlayerAsync(string tournamentId, string userId)
    {
        var tournament = await _context.Tournaments.FindAsync(tournamentId);
        if (tournament == null) throw new Exception("Tournament not found");

        if (tournament.RegisteredPlayerIds.Contains(userId))
            throw new Exception("User already registered");

        tournament.RegisteredPlayerIds.Add(userId);
        await _context.SaveChangesAsync();
        return tournament;
    }

    public async Task<List<Tournament>> GetTournamentsForUserAsync(string userId)
    {
        return await _context.Tournaments
            .Where(t => t.RegisteredPlayerIds.Contains(userId))
            .ToListAsync();
    }
}
