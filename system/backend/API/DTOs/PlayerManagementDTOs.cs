namespace Toros.Backend.DTOs;

public class SearchPlayerRequest
{
    public string Query { get; set; } = string.Empty;
}

public class AddPlayerRequest
{
    public string UserId { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
}

public class CheckInRequest
{
    public string QrData { get; set; } = string.Empty;
}

public class QRCodeData
{
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string QrVersion { get; set; } = string.Empty;
}

public class CreateTeamRequest
{
    public string? Name { get; set; }
    public string Player1Id { get; set; } = string.Empty;
    public string? Player2Id { get; set; }
}
