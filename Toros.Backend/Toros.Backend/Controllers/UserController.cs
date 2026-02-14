using Microsoft.AspNetCore.Mvc;
using Toros.Backend.DTOs;
using Toros.Backend.Interfaces;
using Toros.Backend.Models;
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

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var auth0Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(auth0Id)) return Unauthorized();

        var user = await _userService.GetUserByAuth0IdAsync(auth0Id);
        if (user == null)
        {
            // In a real scenario, we'd trigger the GetOrCreate logic here if it's the first login
            // For now, return 404
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UserProfileDto dto)
    {
        var auth0Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(auth0Id)) return Unauthorized();

        var userUpdate = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            Bio = dto.Bio,
            Picture = dto.Picture
        };

        var updatedUser = await _userService.UpdateUserProfileAsync(auth0Id, userUpdate);
        return Ok(updatedUser);
    }
}
