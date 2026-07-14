using Microsoft.AspNetCore.Mvc;
using Toros.Backend.Interfaces;
using Toros.Common.Models;

namespace Toros.Backend.Controllers;

[ApiController]
[Route("api/stages")]
public class StageController : ControllerBase
{
    private readonly IStageService _stageService;
    private readonly ILogger<StageController> _logger;

    public StageController(IStageService stageService, ILogger<StageController> logger)
    {
        _stageService = stageService;
        _logger = logger;
    }

    [HttpGet("tournament/{tournamentId}")]
    public async Task<IActionResult> GetStages(string tournamentId)
    {
        var stages = await _stageService.GetStagesForTournamentAsync(tournamentId);
        return Ok(stages);
    }

    [HttpPost("{stageId}/generate-matches")]
    public async Task<IActionResult> GenerateMatches(string stageId)
    {
        try
        {
            await _stageService.GenerateMatchesForStageAsync(stageId);
            return Ok(new { message = "Matches generated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating matches for stage {StageId}", stageId);
            return BadRequest(new { message = ex.Message });
        }
    }
}
