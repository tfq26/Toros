using Toros.Backend.Models;

namespace Toros.Backend.Interfaces;

public interface ITeamService
{
    Task<Team> CreateTeamAsync(Team newTeam);
    Task<Team> UpdateTeamAsync(string id, Team teamDetails);
    Task DeleteTeamAsync(string teamId);
    Task<List<Team>> GetTopTeamsAsync(int count);
    Task<List<Team>> GetStandingsAsync();
    Task<List<Team>> GenerateTeamsAsync();
    Task<List<Team>> GetAllTeamsAsync();
    Task<List<Team>> GetTeamsByTournamentIdAsync(string tournamentId);
}
