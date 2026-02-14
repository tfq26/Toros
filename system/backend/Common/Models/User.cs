using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Toros.Common.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string ExternalId { get; set; } = string.Empty; // WorkOS User ID
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Picture { get; set; }
        public string? Bio { get; set; }
        
        public string Role { get; set; } = "USER"; // USER, ADMIN, REFEREE
        public bool Enabled { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public string? PlayerProfileId { get; set; }
        public Player? PlayerProfile { get; set; }
    }
}
