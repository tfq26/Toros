using Toros.Common.Models;
using Toros.Backend.DTOs;

namespace Toros.Backend.Interfaces;

public interface ITournamentSetupService
{
    Task<Tournament?> SetupTournamentAsync(TournamentSetupRequest request);
    Task DeleteTournamentAsync(string tournamentId);
    Task<bool> CheckForDuplicateTournamentAsync(string tournamentName);
}
