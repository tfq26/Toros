using Toros.Common.Models;

namespace Toros.Backend.Interfaces;

public interface IUserService
{
    Task<User> GetOrCreateByExternalIdAsync(string externalId, string accessToken);
    Task<User?> GetUserByIdAsync(string id);
    Task<User?> GetUserByExternalIdAsync(string externalId);
    Task<User> UpdateUserProfileAsync(string externalId, User profileUpdates);
    Task<string> AuthenticateAsync(string email, string password);
}
