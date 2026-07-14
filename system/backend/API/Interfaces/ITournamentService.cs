using Toros.Common.Models;

namespace Toros.Backend.Interfaces;

public interface ITournamentService
{
    Task<List<Tournament>> GetAllTournamentsAsync();
    Task<List<Tournament>> FindTournamentsByOrganizerIdAsync(string auth0Id);
    Task<List<Tournament>> GetTournamentsByStatusAsync(Toros.Common.Enums.TournamentStatus status);
    Task<Tournament?> GetTournamentByIdAsync(string tournamentId);
    Task<Team> AddTeamToTournamentAsync(string tournamentId, Team newTeam);
    Task EndTournamentAsync(string tournamentId);
    Task<Tournament> RegisterPlayerAsync(string tournamentId, string userId);
    Task<List<Tournament>> GetTournamentsForUserAsync(string userId);
    Task<List<Tournament>> GetOrganizedTournamentsAsync(string userId);
    Task<List<Tournament>> GetJoinedTournamentsAsync(string userId);
    
    // Player Management
    Task<bool> IsPlayerRegisteredAsync(string tournamentId, string userId);
    Task<TournamentPlayer> AddPlayerToTournamentAsync(string tournamentId, string userId, string? displayName = null);
}
