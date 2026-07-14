using Microsoft.AspNetCore.Mvc;
using Toros.Backend.DTOs;
using Toros.Backend.Interfaces;
using Toros.Common.Models;
using System.Security.Claims;
using Toros.Backend.Services;

namespace Toros.Backend.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly WorkOSUserManagementService _workosService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<UserController> _logger;

    public UserController(
        IUserService userService, 
        WorkOSUserManagementService workosService,
        IConfiguration configuration,
        ILogger<UserController> logger)
    {
        _userService = userService;
        _workosService = workosService;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpGet("login")]
    public IActionResult Login()
    {
        var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:5173";
        var redirectUri = $"{Request.Scheme}://{Request.Host}/api/users/callback";
        var authorizationUrl = _workosService.GetAuthorizationUrl(redirectUri);
        return Redirect(authorizationUrl);
    }

    [HttpGet("callback")]
    public async Task<IActionResult> Callback([FromQuery] string code)
    {
        try
        {
            var redirectUri = $"{Request.Scheme}://{Request.Host}/api/users/callback";
            var token = await _userService.AuthenticateWithCodeAsync(code, redirectUri);
            var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:5173";
            
            // Redirect back to frontend with the token
            return Redirect($"{frontendUrl}/auth/callback?token={token}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Callback failed");
            var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:5173";
            return Redirect($"{frontendUrl}/login?error={Uri.EscapeDataString(ex.Message)}");
        }
    }

    [HttpGet("logout")]
    public IActionResult Logout()
    {
        var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:5173";
        return Redirect(frontendUrl);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        // This endpoint will be protected by JWT middleware soon, 
        // for now let's just extract the user if the token is passed in header
        var authHeader = Request.Headers["Authorization"].ToString();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return Unauthorized();
        }

        var token = authHeader.Substring(7);
        try 
        {
            // Simple verification for now without full middleware setup
            var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var externalId = jwtToken.Subject;
            
            var user = await _userService.GetUserByExternalIdAsync(externalId);
            if (user == null) return NotFound();
            
            return Ok(new { user, token });
        }
        catch 
        {
            return Unauthorized();
        }
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] RegisterRequest request)
    {
        try
        {
            var user = await _userService.RegisterAsync(request.Email, request.Password, request.FirstName, request.LastName);
            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
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
    public async Task<ActionResult<User>> UpdateProfile(string externalId, [FromBody] Toros.Common.Models.UpdateProfileDto profileUpdates)
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
