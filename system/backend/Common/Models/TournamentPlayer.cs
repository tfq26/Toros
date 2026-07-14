using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Toros.Common.Models
{
    public class TournamentPlayer
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string TournamentId { get; set; } = string.Empty;
        
        [ForeignKey(nameof(TournamentId))]
        public Tournament? Tournament { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        // Snapshot of the player's name at the time of registration, or a custom display name
        public string DisplayName { get; set; } = string.Empty;

        // Seeding or Ranking for this specific tournament
        public int Seed { get; set; }

        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    }
}
