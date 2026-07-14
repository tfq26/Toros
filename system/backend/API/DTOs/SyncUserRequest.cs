namespace Toros.Backend.DTOs;

public class SyncUserRequest
{
    public string ExternalId { get; set; } = string.Empty;
    public string AccessToken { get; set; } = string.Empty;
}
