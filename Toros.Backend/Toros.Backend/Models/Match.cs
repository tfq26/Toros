using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Toros.Backend.Models;

[Table("matches")]
public class Match
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public int CourtNumber { get; set; }

    public string Team1Id { get; set; } = string.Empty;
    [ForeignKey(nameof(Team1Id))]
    public Team Team1 { get; set; } = null!;

    public string Team2Id { get; set; } = string.Empty;
    [ForeignKey(nameof(Team2Id))]
    public Team Team2 { get; set; } = null!;

    public int Team1Score { get; set; }
    public int Team2Score { get; set; }

    public string Status { get; set; } = "SCHEDULED"; // SCHEDULED, IN_PROGRESS, COMPLETED

    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }

    [Required]
    public string TournamentId { get; set; } = string.Empty;

    public string? NextMatchId { get; set; }
    public string? BracketType { get; set; } // WINNERS, LOSERS
    public int RoundNumber { get; set; }
}
