using Microsoft.AspNetCore.SignalR;

namespace Toros.Backend.Hubs;

public class MatchHub : Hub
{
    public async Task JoinTournamentGroup(string tournamentId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, tournamentId);
    }

    public async Task LeaveTournamentGroup(string tournamentId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, tournamentId);
    }
}
