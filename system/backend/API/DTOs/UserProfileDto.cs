namespace Toros.Backend.DTOs;

public class UserProfileDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Picture { get; set; } = string.Empty;
    public string SkillLevel { get; set; } = "Beginner";
}
