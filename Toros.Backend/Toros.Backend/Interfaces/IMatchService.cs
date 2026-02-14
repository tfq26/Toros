using Toros.Backend.Models;

namespace Toros.Backend.Interfaces;

public interface IMatchService
{
    Task<Match?> GetMatchByIdAsync(string id);
    Task<List<Match>> GetMatchesByTournamentIdAsync(string tournamentId);
    Task<Match> UpdateMatchScoreAsync(string id, int team1Score, int team2Score);
    Task<Match> CompleteMatchAsync(string id);
}
