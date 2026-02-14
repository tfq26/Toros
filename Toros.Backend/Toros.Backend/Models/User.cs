using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Toros.Backend.Models;

[Table("users")]
public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [StringLength(20, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    public string? Picture { get; set; }

    public string? Bio { get; set; }

    public string? Auth0Id { get; set; }

    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Phone]
    public string Phone { get; set; } = string.Empty;

    public string Role { get; set; } = "USER";
    public bool Enabled { get; set; } = true;

    public string? PlayerProfileId { get; set; }
    [ForeignKey(nameof(PlayerProfileId))]
    public Player? PlayerProfile { get; set; }
}
