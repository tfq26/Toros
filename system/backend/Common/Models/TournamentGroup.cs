using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Toros.Common.Models
{
    public class TournamentGroup
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string StageId { get; set; } = string.Empty;

        [ForeignKey(nameof(StageId))]
        public TournamentStage? Stage { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty; // "Group A", "Pool 1"

        // JSON list of Player IDs or Team IDs assigned to this group
        public List<string> ParticipantIds { get; set; } = new();
    }
}
