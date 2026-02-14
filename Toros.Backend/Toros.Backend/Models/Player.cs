using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Toros.Backend.Models;

[Table("players")]
public class Player
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string Name { get; set; } = string.Empty;

    public int Age { get; set; }

    public string ContactInfo { get; set; } = string.Empty;

    public string SkillLevel { get; set; } = string.Empty; // e.g. "3.5", "4.0"

    public int TeamNumber { get; set; }

    public string Status { get; set; } = "ACTIVE"; // ACTIVE, INACTIVE

    public string? Auth0Id { get; set; }

    // Navigation properties can be added later as needed
}
