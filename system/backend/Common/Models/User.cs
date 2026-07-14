using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Toros.Common.Enums;

namespace Toros.Common.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string ExternalId { get; set; } = string.Empty; // WorkOS User ID
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        // Computed property for frontend compatibility
        public string Name => $"{FirstName} {LastName}".Trim();
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Picture { get; set; }
        public string? Bio { get; set; }
        
        // --- Added from Player Model ---
        public int Age { get; set; }
        public int SkillLevel { get; set; } = 1; // 1=Beginner, 2=Int, 3=Adv
        public string? ContactInfo { get; set; } 

        public UserRole Role { get; set; } = UserRole.Player;
        public UserStatus Status { get; set; } = UserStatus.Active;
        public bool Enabled { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
