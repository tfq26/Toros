using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Toros.Backend.Data;
using Toros.Backend.Hubs;
using Toros.Backend.Interfaces;
using Toros.Common.Models;

namespace Toros.Backend.Services;

public class MatchService : IMatchService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<MatchHub> _hubContext;
    private readonly ILogger<MatchService> _logger;

    public MatchService(
        AppDbContext context,
        IHubContext<MatchHub> hubContext,
        ILogger<MatchService> logger)
    {
        _context = context;
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task<Match?> GetMatchByIdAsync(string id)
    {
        return await _context.Matches
            .Include(m => m.Team1)
            .Include(m => m.Team2)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<List<Match>> GetMatchesByTournamentIdAsync(string tournamentId)
    {
        return await _context.Matches
            .Where(m => m.TournamentId == tournamentId)
            .Include(m => m.Team1)
            .Include(m => m.Team2)
            .ToListAsync();
    }

    public async Task<Match> UpdateMatchScoreAsync(string id, int team1Score, int team2Score)
    {
        var match = await _context.Matches.FindAsync(id);
        if (match == null) throw new Exception("Match not found");

        match.Team1Score = team1Score;
        match.Team2Score = team2Score;
        match.Status = "IN_PROGRESS";

        await _context.SaveChangesAsync();

        // Notify via SignalR
        await _hubContext.Clients.Group(match.TournamentId).SendAsync("ScoreUpdated", new
        {
            match.Id,
            match.Team1Score,
            match.Team2Score,
            match.Status
        });

        return match;
    }

    public async Task<Match> CompleteMatchAsync(string id)
    {
        var match = await _context.Matches
            .Include(m => m.Team1)
            .Include(m => m.Team2)
            .FirstOrDefaultAsync(m => m.Id == id);
            
        if (match == null) throw new Exception("Match not found");

        match.Status = "COMPLETED";
        match.EndTime = DateTime.UtcNow;

        // Update team records
        if (match.Team1Score > match.Team2Score)
        {
            match.Team1.Wins++;
            match.Team2.Losses++;
        }
        else if (match.Team2Score > match.Team1Score)
        {
            match.Team2.Wins++;
            match.Team1.Losses++;
        }

        match.Team1.MatchesPlayed++;
        match.Team2.MatchesPlayed++;
        match.Team1.TotalPoints += match.Team1Score;
        match.Team2.TotalPoints += match.Team2Score;

        await _context.SaveChangesAsync();

        // Notify via SignalR
        await _hubContext.Clients.Group(match.TournamentId).SendAsync("MatchCompleted", match);

        return match;
    }
}
