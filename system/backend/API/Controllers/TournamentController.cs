using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Toros.Backend.Data;
using Toros.Backend.DTOs;
using Toros.Backend.Interfaces;
using Toros.Backend.Services;
using Toros.Common.Models;

namespace Toros.Backend.Controllers;

[ApiController]
[Route("api/tournaments")]
public class TournamentController : ControllerBase
{
    private readonly ITournamentSetupService _setupService;
    private readonly ITournamentService _tournamentService;
    private readonly WorkOSUserManagementService _workOSService;
    private readonly AppDbContext _context;
    private readonly ILogger<TournamentController> _logger;

    public TournamentController(
        ITournamentSetupService setupService,
        ITournamentService tournamentService,
        WorkOSUserManagementService workOSService,
        AppDbContext context,
        ILogger<TournamentController> logger)
    {
        _setupService = setupService;
        _tournamentService = tournamentService;
        _workOSService = workOSService;
        _context = context;
        _logger = logger;
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllTournaments()
    {
        var tournaments = await _tournamentService.GetAllTournamentsAsync();
        return Ok(tournaments);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyTournaments([FromHeader(Name = "X-User-Id")] string? userId)
    {
        // For now, accept userId from header. TODO: Replace with proper authentication
        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest("User ID is required. Please provide X-User-Id header.");
        }

        var tournaments = await _tournamentService.GetTournamentsForUserAsync(userId);
        return Ok(tournaments);
    }

    [HttpGet("organized")]
    public async Task<IActionResult> GetOrganizedTournaments([FromHeader(Name = "X-User-Id")] string? userId)
    {
        if (string.IsNullOrEmpty(userId)) return BadRequest("User ID required.");
        var tournaments = await _tournamentService.GetOrganizedTournamentsAsync(userId);
        return Ok(tournaments);
    }

    [HttpGet("joined")]
    public async Task<IActionResult> GetJoinedTournaments([FromHeader(Name = "X-User-Id")] string? userId)
    {
        if (string.IsNullOrEmpty(userId)) return BadRequest("User ID required.");
        var tournaments = await _tournamentService.GetJoinedTournamentsAsync(userId);
        return Ok(tournaments);
    }

    [HttpPost("setup")]
    public async Task<IActionResult> SetupTournament([FromBody] TournamentSetupRequest request)
    {
        try
        {
            var tournament = await _setupService.SetupTournamentAsync(request);
            if (tournament == null)
            {
                return Conflict("A tournament with this name already exists.");
            }
            return Ok(tournament);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting up tournament");
            return StatusCode(500, "Failed to set up the tournament.");
        }
    }

    [HttpGet("{tournamentId}")]
    public async Task<IActionResult> GetTournamentById(string tournamentId)
    {
        var tournament = await _tournamentService.GetTournamentByIdAsync(tournamentId);
        return tournament != null ? Ok(tournament) : NotFound();
    }

    [HttpPost("{tournamentId}/end")]
    public async Task<IActionResult> EndTournament(string tournamentId)
    {
        await _tournamentService.EndTournamentAsync(tournamentId);
        return Ok("Tournament ended successfully.");
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] Dictionary<string, string> payload)
    {
        if (!payload.TryGetValue("tournamentId", out var tournamentId) || 
            !payload.TryGetValue("userId", out var userId))
        {
            return BadRequest("Missing tournamentId or userId");
        }

        var updated = await _tournamentService.RegisterPlayerAsync(tournamentId, userId);
        return Ok(updated);
    }

    [HttpPost("{tournamentId}/players/search")]
    public async Task<IActionResult> SearchPlayer(string tournamentId, [FromBody] SearchPlayerRequest request)
    {
        try
        {
            var query = request.Query?.Trim().ToLower();
            if (string.IsNullOrEmpty(query)) return BadRequest("Search query is required.");

            var results = new List<object>();

            // 1. Search Local Database
            var localUsers = await _context.Users
                .Where(u => u.Email.ToLower().Contains(query) || 
                           u.FirstName.ToLower().Contains(query) || 
                           u.LastName.ToLower().Contains(query) ||
                           u.Username.ToLower().Contains(query))
                .Take(10)
                .ToListAsync();

            foreach (var user in localUsers)
            {
                var alreadyResgistered = await _tournamentService.IsPlayerRegisteredAsync(tournamentId, user.Id);
                results.Add(new { 
                    user = new { 
                        id = user.Id, 
                        firstName = user.FirstName, 
                        lastName = user.LastName, 
                        email = user.Email 
                    }, 
                    alreadyRegistered = alreadyResgistered 
                });
            }

            // 2. Fallback to WorkOS if no local results and query looks like email
            if (results.Count == 0 && query.Contains("@"))
            {
                var workOSUser = await _workOSService.SearchUserByEmail(query);
                if (workOSUser != null)
                {
                    var alreadyResgistered = await _tournamentService.IsPlayerRegisteredAsync(tournamentId, workOSUser.Id);
                    results.Add(new { user = workOSUser, alreadyRegistered = alreadyResgistered });
                }
            }

            if (results.Count == 0)
            {
                return NotFound(new { message = "No players found matching your identifier." });
            }

            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching for player");
            return StatusCode(500, "Failed to search for player.");
        }
    }

    [HttpPost("{tournamentId}/players/add")]
    public async Task<IActionResult> AddPlayer(string tournamentId, [FromBody] AddPlayerRequest request)
    {
        try
        {
            // Verify tournament exists
            var tournament = await _tournamentService.GetTournamentByIdAsync(tournamentId);
            if (tournament == null)
            {
                return NotFound("Tournament not found.");
            }

            // Check if already registered
            var alreadyRegistered = await _tournamentService.IsPlayerRegisteredAsync(tournamentId, request.UserId);
            if (alreadyRegistered)
            {
                return Conflict("Player is already registered for this tournament.");
            }

            // Add player to tournament
            var tournamentPlayer = await _tournamentService.AddPlayerToTournamentAsync(
                tournamentId, 
                request.UserId, 
                request.DisplayName
            );

            return Ok(tournamentPlayer);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding player to tournament");
            return StatusCode(500, "Failed to add player to tournament.");
        }
    }

    [HttpPost("{tournamentId}/players/checkin")]
    public async Task<IActionResult> CheckInPlayer(string tournamentId, [FromBody] CheckInRequest request)
    {
        try
        {
            // Parse QR data
            var qrData = System.Text.Json.JsonSerializer.Deserialize<QRCodeData>(request.QrData);
            
            if (qrData == null || string.IsNullOrEmpty(qrData.UserId))
            {
                return BadRequest("Invalid QR code data");
            }

            // Check if already registered
            var alreadyRegistered = await _tournamentService.IsPlayerRegisteredAsync(tournamentId, qrData.UserId);

            TournamentPlayer tournamentPlayer;
            
            if (!alreadyRegistered)
            {
                // Add player to tournament
                tournamentPlayer = await _tournamentService.AddPlayerToTournamentAsync(
                    tournamentId,
                    qrData.UserId,
                    qrData.Name
                );
            }
            else
            {
                // Get existing player
                tournamentPlayer = await _context.TournamentPlayers
                    .FirstOrDefaultAsync(tp => tp.TournamentId == tournamentId && tp.UserId == qrData.UserId);
            }

            return Ok(new 
            { 
                tournamentPlayer,
                isNewRegistration = !alreadyRegistered
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking in player");
            return StatusCode(500, "Failed to check in player.");
        }
    }

    [HttpPost("{tournamentId}/teams")]
    public async Task<IActionResult> CreateTeam(string tournamentId, [FromBody] CreateTeamRequest request)
    {
        try
        {
            var p1 = await _context.Users.FindAsync(request.Player1Id);
            if (p1 == null) return NotFound("Player 1 not found.");

            User? p2 = null;
            if (!string.IsNullOrEmpty(request.Player2Id))
            {
                p2 = await _context.Users.FindAsync(request.Player2Id);
                if (p2 == null) return NotFound("Player 2 not found.");
            }

            var team = new Team
            {
                TournamentId = tournamentId,
                Name = request.Name ?? (p2 != null ? $"{p1.Name} & {p2.Name}" : p1.Name),
                Player1Id = p1.Id,
                Player2Id = p2?.Id,
                Status = Toros.Common.Enums.TeamStatus.Registered
            };

            var createdTeam = await _tournamentService.AddTeamToTournamentAsync(tournamentId, team);
            return Ok(createdTeam);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating team for tournament {TournamentId}", tournamentId);
            return StatusCode(500, "Failed to create team.");
        }
    }
}
