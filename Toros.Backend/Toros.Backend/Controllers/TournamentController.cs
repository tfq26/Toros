using Microsoft.AspNetCore.Mvc;
using Toros.Backend.DTOs;
using Toros.Backend.Interfaces;
using Toros.Backend.Models;

namespace Toros.Backend.Controllers;

[ApiController]
[Route("api/tournaments")]
public class TournamentController : ControllerBase
{
    private readonly ITournamentSetupService _setupService;
    private readonly ITournamentService _tournamentService;
    private readonly ILogger<TournamentController> _logger;

    public TournamentController(
        ITournamentSetupService setupService,
        ITournamentService tournamentService,
        ILogger<TournamentController> logger)
    {
        _setupService = setupService;
        _tournamentService = tournamentService;
        _logger = logger;
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllTournaments()
    {
        var tournaments = await _tournamentService.GetAllTournamentsAsync();
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
}
