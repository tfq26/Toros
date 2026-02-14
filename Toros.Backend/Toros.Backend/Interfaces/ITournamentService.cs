using Toros.Backend.Models;

namespace Toros.Backend.Interfaces;

public interface ITournamentService
{
    Task<List<Tournament>> GetAllTournamentsAsync();
    Task<List<Tournament>> FindTournamentsByOrganizerIdAsync(string auth0Id);
    Task<List<Tournament>> GetTournamentsByStatusAsync(string status);
    Task<Tournament?> GetTournamentByIdAsync(string tournamentId);
    Task<Team> AddTeamToTournamentAsync(string tournamentId, Team newTeam);
    Task EndTournamentAsync(string tournamentId);
    Task<Tournament> RegisterPlayerAsync(string tournamentId, string userId);
    Task<List<Tournament>> GetTournamentsForUserAsync(string userId);
}
