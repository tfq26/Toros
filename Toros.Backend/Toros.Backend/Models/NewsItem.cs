using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Toros.Backend.Models;

[Table("news")]
public class NewsItem
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string Summary { get; set; } = string.Empty;

    public string Link { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // e.g. "local", "major", "equipment", "app"
    public DateTime PublishedAt { get; set; }
    public string Source { get; set; } = string.Empty;

    public string? CoverImageUrl { get; set; }
}
