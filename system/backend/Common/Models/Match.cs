using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toros.Common.Enums;

namespace Toros.Common.Models
{
    public class Match
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string TournamentId { get; set; } = string.Empty;

        public string? StageId { get; set; }
        [ForeignKey("StageId")]
        public TournamentStage? Stage { get; set; }
        
        public string Team1Id { get; set; } = string.Empty;
        [ForeignKey("Team1Id")]
        public Team Team1 { get; set; } = null!;

        public string Team2Id { get; set; } = string.Empty;
        [ForeignKey("Team2Id")]
        public Team Team2 { get; set; } = null!;

        public int Team1Score { get; set; }
        public int Team2Score { get; set; }

        public string? WinnerId { get; set; }
        public MatchStatus Status { get; set; } = MatchStatus.Pending;

        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string? CourtNumber { get; set; }
        
        public int Round { get; set; }
        public BracketType BracketType { get; set; } = BracketType.Winners; // Default to Winners bracket
    }
}
