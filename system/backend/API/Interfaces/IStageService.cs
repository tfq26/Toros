using Toros.Common.Models;
using Toros.Common.Enums;

namespace Toros.Backend.Interfaces;

public interface IStageService
{
    Task<TournamentStage> CreateStageAsync(string tournamentId, string name, TournamentType type, int sequence);
    Task<List<TournamentStage>> GetStagesForTournamentAsync(string tournamentId);
    Task<TournamentStage?> GetStageByIdAsync(string stageId);
    Task GenerateMatchesForStageAsync(string stageId);
    Task CompleteStageAsync(string stageId);
}
