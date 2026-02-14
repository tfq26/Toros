namespace Toros.Backend.DTOs;

public class UpdateMatchRequest
{
    public int Team1Score { get; set; }
    public int Team2Score { get; set; }
    public string? Status { get; set; }
}
