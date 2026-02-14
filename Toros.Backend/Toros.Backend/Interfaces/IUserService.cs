using Toros.Backend.Models;

namespace Toros.Backend.Interfaces;

public interface IUserService
{
    Task<User> GetOrCreateByAuth0IdAsync(string auth0Id, string accessToken);
    Task<User?> GetUserByIdAsync(string id);
    Task<User?> GetUserByAuth0IdAsync(string auth0Id);
    Task<User> UpdateUserProfileAsync(string auth0Id, User profileUpdates);
}
