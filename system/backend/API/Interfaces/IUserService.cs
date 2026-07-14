using Toros.Common.Models;

namespace Toros.Backend.Interfaces;

public interface IUserService
{
    Task<User> GetOrCreateByExternalIdAsync(Toros.Backend.Services.WorkOSUser workosUser, string accessToken);
    Task<User?> GetUserByIdAsync(string id);
    Task<User?> GetUserByExternalIdAsync(string externalId);
    Task<User> UpdateUserProfileAsync(string externalId, Toros.Common.Models.UpdateProfileDto profileUpdates);
    Task<string> AuthenticateWithCodeAsync(string code, string redirectUri);
    Task<string> GenerateJwtToken(User user);
    Task<User> RegisterAsync(string email, string password, string firstName, string lastName);
    Task<User> UpgradeToDirectorAsync(string userId);
}
