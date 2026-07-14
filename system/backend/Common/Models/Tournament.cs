using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toros.Common.Enums;

namespace Toros.Common.Models
{
    public class Tournament
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Name { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }
        public TournamentStatus Status { get; set; } = TournamentStatus.Draft;

        public string? FinalPlacements { get; set; }
        
        public string? AccessCode { get; set; }
        
        public string? Auth0Id { get; set; } // Organizer ID

        // New properties for service compatibility
        public int NumberOfCourts { get; set; }
        public string Location { get; set; } = string.Empty;
        public string OrganizerName { get; set; } = string.Empty;
        public string OrganizerContact { get; set; } = string.Empty;
        public string AgeGroup { get; set; } = string.Empty;
        public string SkillLevel { get; set; } = string.Empty;
        public string Format { get; set; } = "Doubles"; // Singles, Doubles, Mixed

        // Navigation properties
        public List<TournamentPlayer> Players { get; set; } = new();
        public List<TournamentStage> Stages { get; set; } = new();
        public List<Team> Teams { get; set; } = new();
        public List<Match> Matches { get; set; } = new();
    }
}
