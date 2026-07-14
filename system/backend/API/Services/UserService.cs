using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Toros.Backend.Data;
using Toros.Backend.Interfaces;
using Toros.Common.Models;
using Toros.Common.Enums;

namespace Toros.Backend.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<UserService> _logger;
    private readonly WorkOSUserManagementService _workosUsers;

    public UserService(
        AppDbContext context,
        IConfiguration configuration,
        ILogger<UserService> logger,
        WorkOSUserManagementService workosUsers)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
        _workosUsers = workosUsers;
    }

    public async Task<User> GetOrCreateByExternalIdAsync(WorkOSUser workosUser, string accessToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.ExternalId == workosUser.Id);

        if (user != null) 
        {
            // Sync latest details from WorkOS on every login
            bool changed = false;
            if (user.Picture != workosUser.ProfilePictureUrl) { user.Picture = workosUser.ProfilePictureUrl; changed = true; }
            if (user.FirstName != workosUser.FirstName) { user.FirstName = workosUser.FirstName; changed = true; }
            if (user.LastName != workosUser.LastName) { user.LastName = workosUser.LastName; changed = true; }
            
            if (changed) await _context.SaveChangesAsync();
            return user;
        }

        _logger.LogInformation("Creating new user from WorkOS External ID: {ExternalId}", workosUser.Id);

        user = new User
        {
            ExternalId = workosUser.Id,
            Username = workosUser.Email.Split('@')[0],
            Email = workosUser.Email,
            FirstName = workosUser.FirstName,
            LastName = workosUser.LastName,
            Picture = workosUser.ProfilePictureUrl ?? "",
            Role = UserRole.Player,
            Enabled = true,
            CreatedAt = DateTime.UtcNow,
            SkillLevel = 1,
            Status = UserStatus.Active
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<string> GenerateJwtToken(User user)
    {
        var jwtSecret = _configuration["Jwt:Secret"] ?? "default_secret_key_at_least_32_characters";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.ExternalId),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("firstName", user.FirstName),
            new Claim("lastName", user.LastName),
            new Claim("role", user.Role.ToString()),
            new Claim("id", user.Id)
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<User?> GetUserByIdAsync(string id) => await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

    public async Task<User?> GetUserByExternalIdAsync(string externalId) => await _context.Users.FirstOrDefaultAsync(u => u.ExternalId == externalId);

    public async Task<User> UpdateUserProfileAsync(string externalId, UpdateProfileDto profileUpdates)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.ExternalId == externalId);

        if (user == null) throw new Exception("User not found");

        user.Username = profileUpdates.Username;
        user.FirstName = profileUpdates.FirstName;
        user.LastName = profileUpdates.LastName;
        user.Email = profileUpdates.Email;
        user.Phone = profileUpdates.Phone ?? "";
        user.Bio = profileUpdates.Bio;
        user.Picture = profileUpdates.Picture;
        
        // Map string SkillLevel to int
        user.SkillLevel = profileUpdates.SkillLevel switch
        {
            "Intermediate" => 2,
            "Advanced" => 3,
            _ => 1
        };

        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<string> AuthenticateWithCodeAsync(string code, string redirectUri)
    {
        var ssoResponse = await _workosUsers.GetProfileAndToken(code, redirectUri);
        var user = await GetOrCreateByExternalIdAsync(ssoResponse.Profile, ssoResponse.AccessToken);
        return await GenerateJwtToken(user);
    }

    public async Task<User> RegisterAsync(string email, string password, string firstName, string lastName)
    {
        var workosUser = await _workosUsers.CreateUser(email, password, firstName, lastName);
        var user = new User
        {
            ExternalId = workosUser.Id,
            Username = email.Split('@')[0], 
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            Role = UserRole.Player,
            Enabled = true,
            CreatedAt = DateTime.UtcNow,
            SkillLevel = 1,
            Status = UserStatus.Active
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpgradeToDirectorAsync(string userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");

        if (user.Role == UserRole.Director || user.Role == UserRole.Admin)
            return user;

        user.Role = UserRole.Director;
        await _context.SaveChangesAsync();
        return user;
    }
}
