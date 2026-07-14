using Toros.Common.Enums;
using Toros.Common.Models;
using Microsoft.EntityFrameworkCore;
using Toros.Backend.Data;
using Toros.Backend.Interfaces;

namespace Toros.Backend.Services;

public class TeamService : ITeamService
{
    private readonly AppDbContext _context;
    // ... helper fields removed if unused ...

    public TeamService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Team> CreateTeamAsync(Team newTeam)
    {
        // Assume Players (Users) exist usually, but if new:
        if (newTeam.Player1 != null && string.IsNullOrEmpty(newTeam.Player1.Id))
        {
            newTeam.Player1.Role = UserRole.Player;
            _context.Users.Add(newTeam.Player1);
        }
        if (newTeam.Player2 != null && string.IsNullOrEmpty(newTeam.Player2.Id))
        {
            newTeam.Player2.Role = UserRole.Player;
            _context.Users.Add(newTeam.Player2);
        }

        newTeam.Status = TeamStatus.Registered;
        _context.Teams.Add(newTeam);
        await _context.SaveChangesAsync();
        return newTeam;
    }

    public async Task<Team> UpdateTeamAsync(string id, Team teamDetails)
    {
        var existingTeam = await _context.Teams
            .Include(t => t.Player1)
            .Include(t => t.Player2)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (existingTeam == null)
            throw new Exception($"Team not found with ID: {id}");

        existingTeam.Name = teamDetails.Name;

        if (teamDetails.Player1 != null)
        {
            if (string.IsNullOrEmpty(teamDetails.Player1.Id))
                _context.Users.Add(teamDetails.Player1);
            else
                _context.Entry(teamDetails.Player1).State = EntityState.Modified;
            
            existingTeam.Player1 = teamDetails.Player1;
        }

        if (teamDetails.Player2 != null)
        {
            if (string.IsNullOrEmpty(teamDetails.Player2.Id))
                _context.Users.Add(teamDetails.Player2);
            else
                _context.Entry(teamDetails.Player2).State = EntityState.Modified;
            
            existingTeam.Player2 = teamDetails.Player2;
        }

        await _context.SaveChangesAsync();
        return existingTeam;
    }

    public async Task DeleteTeamAsync(string teamId)
    {
        var team = await _context.Teams.FindAsync(teamId);
        if (team != null)
        {
            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<Team>> GetTopTeamsAsync(int count)
    {
        return await _context.Teams
            .OrderByDescending(t => t.Wins)
            .Take(count)
            .ToListAsync();
    }

    public async Task<List<Team>> GetStandingsAsync()
    {
        return await _context.Teams
            .OrderBy(t => t.Placement == null || t.Placement == 0 ? int.MaxValue : t.Placement)
            .ToListAsync();
    }

    public async Task<List<Team>> GenerateTeamsAsync()
    {
        // Get generic users to form teams (Demo logic?)
        // Filter out admins/referees if desired, or inactive users
        var players = await _context.Users
            .Where(u => u.Role == UserRole.Player && u.Status == UserStatus.Active)
            .ToListAsync();
            
        var teams = new List<Team>();

        for (int i = 0; i < players.Count; i += 2)
        {
            var team = new Team
            {
                Player1 = players[i],
                Player1Id = players[i].Id,
                Status = TeamStatus.Registered,
                TeamNumber = (i / 2) + 1
            };

            if (i + 1 < players.Count)
            {
                team.Player2 = players[i + 1];
                team.Player2Id = players[i + 1].Id;
            }

            // Construct name safely
            var p1Name = $"{team.Player1.FirstName} {team.Player1.LastName}".Trim();
            var p2Name = team.Player2 != null ? $"{team.Player2.FirstName} {team.Player2.LastName}".Trim() : "";
            
            team.Name = string.IsNullOrEmpty(p2Name) ? p1Name : $"{p1Name} & {p2Name}";
            teams.Add(team);
        }

        _context.Teams.AddRange(teams);
        await _context.SaveChangesAsync();
        return teams;
    }

    public async Task<List<Team>> GetAllTeamsAsync() => await _context.Teams.ToListAsync();

    public async Task<List<Team>> GetTeamsByTournamentIdAsync(string tournamentId)
    {
        return await _context.Teams
            .Where(t => t.TournamentId == tournamentId)
            .ToListAsync();
    }
}
