using Microsoft.EntityFrameworkCore;
using WorkOS;
using Toros.Backend.Data;
using Toros.Backend.Interfaces;
using Toros.Common.Models;

namespace Toros.Backend.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<UserService> _logger;
    private readonly UserManagementService _workosUsers;

    public UserService(
        AppDbContext context,
        IConfiguration configuration,
        ILogger<UserService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
        
        // Initialize WorkOS SDK
        WorkOS.WorkOS.ApiKey = _configuration["WorkOS:ApiKey"];
        _workosUsers = new UserManagementService();
    }

    public async Task<User> GetOrCreateByExternalIdAsync(string externalId, string accessToken)
    {
        var user = await _context.Users
            .Include(u => u.PlayerProfile)
            .FirstOrDefaultAsync(u => u.ExternalId == externalId);

        if (user != null) return user;

        _logger.LogInformation("Creating new user from WorkOS External ID: {ExternalId}", externalId);

        // Fetch additional info from WorkOS
        var workosUser = await _workosUsers.GetUser(externalId);
        if (workosUser == null)
        {
             throw new Exception("Failed to fetch user info from WorkOS");
        }

        user = new User
        {
            ExternalId = externalId,
            Username = workosUser.Email.Split('@')[0], // Fallback if no nickname/username
            Email = workosUser.Email,
            FirstName = workosUser.FirstName ?? "",
            LastName = workosUser.LastName ?? "",
            Picture = "", // WorkOS doesn't always have a picture field in the basic User object
            Role = "USER",
            Enabled = true,
            PlayerProfile = new Player
            {
                Name = $"{workosUser.FirstName} {workosUser.LastName}",
                Email = workosUser.Email,
                SkillLevel = 1,
                Status = "Registered"
            }
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User?> GetUserByIdAsync(string id) => await _context.Users.Include(u => u.PlayerProfile).FirstOrDefaultAsync(u => u.Id == id);

    public async Task<User?> GetUserByExternalIdAsync(string externalId) => await _context.Users.Include(u => u.PlayerProfile).FirstOrDefaultAsync(u => u.ExternalId == externalId);

    public async Task<User> UpdateUserProfileAsync(string externalId, User profileUpdates)
    {
        var user = await _context.Users
            .Include(u => u.PlayerProfile)
            .FirstOrDefaultAsync(u => u.ExternalId == externalId);

        if (user == null) throw new Exception("User not found");

        user.FirstName = profileUpdates.FirstName;
        user.LastName = profileUpdates.LastName;
        user.Email = profileUpdates.Email;
        user.Phone = profileUpdates.Phone;
        user.Bio = profileUpdates.Bio;
        user.Picture = profileUpdates.Picture;

        if (user.PlayerProfile != null)
        {
            user.PlayerProfile.Name = $"{user.FirstName} {user.LastName}";
            user.PlayerProfile.Email = user.Email;
            user.PlayerProfile.Phone = user.Phone;
        }

        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<string> AuthenticateAsync(string email, string password)
    {
        try
        {
            var response = await _workosUsers.AuthenticateWithPassword(new AuthenticateWithPasswordOptions
            {
                Email = email,
                Password = password,
                ClientId = _configuration["WorkOS:ClientId"]
            });

            return response.AccessToken;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Authentication failed for {Email}", email);
            throw;
        }
    }
}
