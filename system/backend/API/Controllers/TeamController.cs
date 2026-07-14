using Microsoft.AspNetCore.Mvc;
using Toros.Backend.Interfaces;
using Toros.Common.Models;

namespace Toros.Backend.Controllers;

[ApiController]
[Route("api/teams")]
public class TeamController : ControllerBase
{
    private readonly ITeamService _teamService;
    private readonly ILogger<TeamController> _logger;

    public TeamController(ITeamService teamService, ILogger<TeamController> logger)
    {
        _teamService = teamService;
        _logger = logger;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTeam(string id, [FromBody] Team team)
    {
        try
        {
            var updatedTeam = await _teamService.UpdateTeamAsync(id, team);
            return Ok(updatedTeam);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating team {Id}", id);
            return StatusCode(500, "Failed to update team.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeam(string id)
    {
        try
        {
            await _teamService.DeleteTeamAsync(id);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting team {Id}", id);
            return StatusCode(500, "Failed to delete team.");
        }
    }
}
