namespace Toros.Backend.DTOs;

public class TournamentSetupRequest
{
    public string TournamentName { get; set; } = string.Empty;
    public int NumCourts { get; set; }
    public int GamesPerTeam { get; set; }
    public bool IsSkillBased { get; set; }
    public int MatchDuration { get; set; }
    public int BreakTime { get; set; }
    public DateTime StartTime { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Organizer { get; set; } = string.Empty;
    public string ContactInfo { get; set; } = string.Empty;
    public string TournamentType { get; set; } = "Round Robin";
    public string ScoringSystem { get; set; } = "Rally";
    public string Rules { get; set; } = string.Empty;
    public string PrizeDistribution { get; set; } = string.Empty;
    public string Format { get; set; } = "Doubles";
    public string AgeGroup { get; set; } = string.Empty;
    public string SkillLevel { get; set; } = string.Empty;
    public string? Auth0Id { get; set; }
    public string? UserId { get; set; } // User ID from frontend
    public bool? ConfirmDelete { get; set; }
}
