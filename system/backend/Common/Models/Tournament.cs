using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Toros.Common.Models
{
    public class Tournament
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Type { get; set; } = "SINGLE_ELIMINATION"; // SINGLE_ELIMINATION, ROUND_ROBIN

        public DateTime StartDate { get; set; }
        public string Status { get; set; } = "DRAFT"; // DRAFT, OPEN, ONGOING, COMPLETED

        public string? SetupProperties { get; set; }
        public Dictionary<string, string>? SetupPropertiesMap { get; set; }
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

        public List<string> RegisteredPlayerIds { get; set; } = new();

        // Navigation properties
        public List<Team> Teams { get; set; } = new();
        public List<Match> Matches { get; set; } = new();
    }
}
