using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Text.Json;
using Toros.Backend.Data;
using Toros.Backend.Interfaces;
using Toros.Backend.Models;

namespace Toros.Backend.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<UserService> _logger;

    public UserService(
        AppDbContext context,
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<UserService> logger)
    {
        _context = context;
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<User> GetOrCreateByAuth0IdAsync(string auth0Id, string accessToken)
    {
        var user = await _context.Users
            .Include(u => u.PlayerProfile)
            .FirstOrDefaultAsync(u => u.Auth0Id == auth0Id);

        if (user != null) return user;

        _logger.LogInformation("Creating new user from Auth0 ID: {Auth0Id}", auth0Id);

        // Fetch additional info from Auth0
        var issuer = _configuration["Auth0:Domain"];
        var request = new HttpRequestMessage(HttpMethod.Get, $"https://{issuer}/userinfo");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
             throw new Exception("Failed to fetch user info from Auth0");
        }

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        user = new User
        {
            Auth0Id = auth0Id,
            Username = root.GetProperty("nickname").GetString() ?? "",
            Email = root.GetProperty("email").GetString() ?? "",
            FirstName = root.GetProperty("given_name").GetString() ?? "",
            LastName = root.GetProperty("family_name").GetString() ?? "",
            Picture = root.GetProperty("picture").GetString() ?? "",
            Role = "USER",
            Enabled = true,
            PlayerProfile = new Player
            {
                Name = $"{root.GetProperty("given_name").GetString()} {root.GetProperty("family_name").GetString()}",
                Email = root.GetProperty("email").GetString() ?? "",
                SkillLevel = 1,
                Status = "Registered"
            }
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User?> GetUserByIdAsync(string id) => await _context.Users.Include(u => u.PlayerProfile).FirstOrDefaultAsync(u => u.Id == id);

    public async Task<User?> GetUserByAuth0IdAsync(string auth0Id) => await _context.Users.Include(u => u.PlayerProfile).FirstOrDefaultAsync(u => u.Auth0Id == auth0Id);

    public async Task<User> UpdateUserProfileAsync(string auth0Id, User profileUpdates)
    {
        var user = await _context.Users
            .Include(u => u.PlayerProfile)
            .FirstOrDefaultAsync(u => u.Auth0Id == auth0Id);

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
}
