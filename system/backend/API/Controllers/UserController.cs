using Microsoft.AspNetCore.Mvc;
using Toros.Backend.DTOs;
using Toros.Backend.Interfaces;
using Toros.Common.Models;
using System.Security.Claims;

namespace Toros.Backend.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UserController> _logger;

    public UserController(IUserService userService, ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpPost("sync")]
    public async Task<IActionResult> SyncUser([FromBody] SyncUserRequest request)
    {
        try
        {
            var user = await _userService.GetOrCreateByExternalIdAsync(request.ExternalId, request.AccessToken);
            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("external/{externalId}")]
    public async Task<ActionResult<User>> GetByExternalId(string externalId)
    {
        var user = await _userService.GetUserByExternalIdAsync(externalId);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPut("profile/{externalId}")]
    public async Task<ActionResult<User>> UpdateProfile(string externalId, [FromBody] User profileUpdates)
    {
        try
        {
            var user = await _userService.UpdateUserProfileAsync(externalId, profileUpdates);
            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
