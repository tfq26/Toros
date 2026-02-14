using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Toros.Backend.Models;

[Table("registrations")]
public class Registration
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string TournamentId { get; set; } = string.Empty;

    [Required]
    public string UserId { get; set; } = string.Empty;

    public string? TeamId { get; set; }
    
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
}
