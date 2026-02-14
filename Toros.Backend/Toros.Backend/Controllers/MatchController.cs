using Microsoft.AspNetCore.Mvc;
using Toros.Backend.DTOs;
using Toros.Backend.Interfaces;

namespace Toros.Backend.Controllers;

[ApiController]
[Route("api/match")]
public class MatchController : ControllerBase
{
    private readonly IMatchService _matchService;
    private readonly ILogger<MatchController> _logger;

    public MatchController(IMatchService matchService, ILogger<MatchController> logger)
    {
        _matchService = matchService;
        _logger = logger;
    }

    [HttpGet("{matchId}")]
    public async Task<IActionResult> GetMatchById(string matchId)
    {
        var match = await _matchService.GetMatchByIdAsync(matchId);
        return match != null ? Ok(match) : NotFound();
    }

    [HttpGet("tournament/{tournamentId}")]
    public async Task<IActionResult> GetMatchesByTournament(string tournamentId)
    {
        var matches = await _matchService.GetMatchesByTournamentIdAsync(tournamentId);
        return Ok(matches);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateMatch(string id, [FromBody] UpdateMatchRequest request)
    {
        try
        {
            var updatedMatch = await _matchService.UpdateMatchScoreAsync(id, request.Team1Score, request.Team2Score);
            
            if (request.Status == "COMPLETED")
            {
                updatedMatch = await _matchService.CompleteMatchAsync(id);
            }

            return Ok(updatedMatch);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating match {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}
