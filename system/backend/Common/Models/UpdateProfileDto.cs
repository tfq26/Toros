namespace Toros.Common.Models
{
    public class UpdateProfileDto
    {
        public string Username { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Bio { get; set; }
        public string? Picture { get; set; }
        public string SkillLevel { get; set; } = "Beginner";
    }
}
