using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Toros.Backend.Models;

[Table("teams")]
public class Team
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string Name { get; set; } = string.Empty;

    // Mandatory first player
    public string Player1Id { get; set; } = string.Empty;
    [ForeignKey(nameof(Player1Id))]
    public Player Player1 { get; set; } = null!;

    // Optional second player
    public string? Player2Id { get; set; }
    [ForeignKey(nameof(Player2Id))]
    public Player? Player2 { get; set; }

    public int TeamScore { get; set; }
    public int Wins { get; set; }
    public int Losses { get; set; }
    public int MatchesPlayed { get; set; }
    public int TotalPoints { get; set; }

    public string TournamentId { get; set; } = string.Empty;
    public string Status { get; set; } = "Registered"; // e.g. "Registered", "Checked In"
    public string? MatchId { get; set; } // current match
    public string? MatchStatus { get; set; } // e.g. "Scheduled", "In Progress"

    public int SkillLevel { get; set; } // 1=Beginner, 2=Intermediate, 3=Advanced

    // In C#, we don't strictly need the updatePlayersList logic if we use the navigation properties,
    // but we can keep a list of IDs if the frontend expects it.
    [NotMapped]
    public List<string> PlayerIds => new List<string?> { Player1Id, Player2Id }
        .Where(id => !string.IsNullOrEmpty(id))
        .Select(id => id!)
        .ToList();

    public int? Placement { get; set; }

    public string SkillLevelString => SkillLevel switch
    {
        1 => "Beginner",
        2 => "Intermediate",
        3 => "Advanced",
        _ => "Unknown"
    };

    public void RecalcSkillLevel()
    {
        int s1 = Player1?.SkillLevel == "Advanced" ? 3 : Player1?.SkillLevel == "Intermediate" ? 2 : 1;
        int s2 = Player2?.SkillLevel == "Advanced" ? 3 : Player2?.SkillLevel == "Intermediate" ? 2 : 1;
        
        double avg = (s1 + s2) / 2.0;
        SkillLevel = avg <= 1.5 ? 1 : avg <= 2.5 ? 2 : 3;
    }
}
