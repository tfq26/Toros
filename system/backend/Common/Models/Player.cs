using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Toros.Common.Models
{
    public class Player
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Name { get; set; } = string.Empty;

        public int Age { get; set; }

        public string ContactInfo { get; set; } = string.Empty;

        public int SkillLevel { get; set; } // e.g. 1, 2, 3, 4, 5

        public int TeamNumber { get; set; }

        public string Status { get; set; } = "ACTIVE"; // ACTIVE, INACTIVE, Registered

        public string? Auth0Id { get; set; }

        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }
}
