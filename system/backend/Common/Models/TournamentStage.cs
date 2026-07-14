using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Toros.Common.Enums;

namespace Toros.Common.Models
{
    public class TournamentStage
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string TournamentId { get; set; } = string.Empty;

        [ForeignKey(nameof(TournamentId))]
        [JsonIgnore] // Prevent circular reference during serialization
        public Tournament? Tournament { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty; // e.g. "Pool Play", "Knockout"

        [Required]
        public int SequenceOrder { get; set; } // 1, 2, 3...

        public TournamentType Type { get; set; } = TournamentType.SingleElimination; // Reusing Enum for stage type

        // JSON string to store specific settings for this stage 
        // (e.g. "PointsPerWin": 3, "AdvancersPerGroup": 2)
        public string Settings { get; set; } = "{}";

        public TournamentStatus Status { get; set; } = TournamentStatus.Draft;
        
        // Navigation Properties
        public List<TournamentGroup> Groups { get; set; } = new();
    }
}
