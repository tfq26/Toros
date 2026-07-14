using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toros.Common.Enums;

namespace Toros.Common.Models
{
    public class Team
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Name { get; set; } = string.Empty;

        public int TeamNumber { get; set; } // Replaced Player.TeamNumber

        public string Player1Id { get; set; } = string.Empty;
        [ForeignKey("Player1Id")]
        public User Player1 { get; set; } = null!;

        public string? Player2Id { get; set; }
        [ForeignKey("Player2Id")]
        public User? Player2 { get; set; }

        public string TournamentId { get; set; } = string.Empty;

        public TeamStatus Status { get; set; } = TeamStatus.Registered;

        public int Wins { get; set; }
        public int Losses { get; set; }
        public int MatchesPlayed { get; set; }
        public int TotalPoints { get; set; }
        public int? Placement { get; set; }
    }
}
