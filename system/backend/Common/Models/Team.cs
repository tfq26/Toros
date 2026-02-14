using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Toros.Common.Models
{
    public class Team
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Player1Id { get; set; } = string.Empty;
        [ForeignKey("Player1Id")]
        public Player Player1 { get; set; } = null!;

        public string? Player2Id { get; set; }
        [ForeignKey("Player2Id")]
        public Player? Player2 { get; set; }

        public string TournamentId { get; set; } = string.Empty;

        public string Status { get; set; } = "REGISTERED"; // REGISTERED, ACTIVE, ELIMINATED

        public int Wins { get; set; }
        public int Losses { get; set; }
        public int MatchesPlayed { get; set; }
        public int TotalPoints { get; set; }
        public int? Placement { get; set; }
    }
}
