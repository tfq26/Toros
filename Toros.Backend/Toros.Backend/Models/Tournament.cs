using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Toros.Backend.Models;

[Table("tournaments")]
public class Tournament
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string Name { get; set; } = string.Empty;

    public string Status { get; set; } = "DRAFT"; // DRAFT, LIVE, COMPLETED

    public string Location { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public int MaxTeams { get; set; }
    public int NumberOfCourts { get; set; }

    public string OrganizerName { get; set; } = string.Empty;
    public string OrganizerContact { get; set; } = string.Empty;

    public string Type { get; set; } = "Round Robin"; // Round Robin, Single Elim, Double Elim
    public string AgeGroup { get; set; } = string.Empty;
    public string SkillLevel { get; set; } = string.Empty;

    public string? Auth0Id { get; set; }
    public string? AccessCode { get; set; }

    // Navigation properties
    public List<Team> Teams { get; set; } = new();
    public List<Match> Matches { get; set; } = new();

    // Map/List properties - stored as JSONB in Postgres
    [Column(TypeName = "jsonb")]
    public List<string> SetupProperties { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<string, string> SetupPropertiesMap { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public List<string> FinalPlacements { get; set; } = new();

    public List<string> RegisteredPlayerIds { get; set; } = new();
}
