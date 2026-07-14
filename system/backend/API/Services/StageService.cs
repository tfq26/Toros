using Microsoft.EntityFrameworkCore;
using Toros.Backend.Data;
using Toros.Backend.Interfaces;
using Toros.Common.Models;
using Toros.Common.Enums;

namespace Toros.Backend.Services;

public class StageService : IStageService
{
    private readonly AppDbContext _context;
    private readonly ILogger<StageService> _logger;

    public StageService(AppDbContext context, ILogger<StageService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<TournamentStage> CreateStageAsync(string tournamentId, string name, TournamentType type, int sequence)
    {
        var stage = new TournamentStage
        {
            TournamentId = tournamentId,
            Name = name,
            Type = type,
            SequenceOrder = sequence,
            Status = TournamentStatus.Draft
        };

        _context.TournamentStages.Add(stage);
        await _context.SaveChangesAsync();
        return stage;
    }

    public async Task<List<TournamentStage>> GetStagesForTournamentAsync(string tournamentId)
    {
        return await _context.TournamentStages
            .Where(s => s.TournamentId == tournamentId)
            .OrderBy(s => s.SequenceOrder)
            .Include(s => s.Groups)
            .ToListAsync();
    }

    public async Task<TournamentStage?> GetStageByIdAsync(string stageId)
    {
        return await _context.TournamentStages
            .Include(s => s.Groups)
            .FirstOrDefaultAsync(s => s.Id == stageId);
    }

    public async Task GenerateMatchesForStageAsync(string stageId)
    {
        var stage = await _context.TournamentStages
            .Include(s => s.Tournament)
            .ThenInclude(t => t.Teams)
            .FirstOrDefaultAsync(s => s.Id == stageId);

        if (stage == null) throw new Exception("Stage not found");

        if (stage.Status == TournamentStatus.Completed) 
            throw new Exception("Stage is already completed");

        // Logic depends on Stage Type
        // For now, simple Round Robin implementation reusing all teams in tournament
        // In future, this should filter teams eligible for this stage
        var teams = stage.Tournament.Teams; 
        
        // Basic All-vs-All generator (Round Robin)
        var matches = new List<Match>();
        for (int i = 0; i < teams.Count; i++)
        {
            for (int j = i + 1; j < teams.Count; j++)
            {
                var match = new Match
                {
                    TournamentId = stage.TournamentId,
                    StageId = stage.Id,
                    Team1Id = teams[i].Id,
                    Team2Id = teams[j].Id,
                    Status = MatchStatus.Pending,
                    StartTime = DateTime.UtcNow.AddMinutes(10 * matches.Count), // Placeholder scheduling
                    Round = 1
                };
                matches.Add(match);
            }
        }

        _context.Matches.AddRange(matches);
        stage.Status = TournamentStatus.Open;
        await _context.SaveChangesAsync();
    }

    public async Task CompleteStageAsync(string stageId)
    {
        var stage = await _context.TournamentStages.FindAsync(stageId);
        if (stage != null)
        {
            stage.Status = TournamentStatus.Completed;
            await _context.SaveChangesAsync();
        }
    }
}
