using Microsoft.EntityFrameworkCore;
using Toros.Common.Models;

namespace Toros.Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Player> Players { get; set; } = null!;
    public DbSet<Team> Teams { get; set; } = null!;
    public DbSet<Match> Matches { get; set; } = null!;
    public DbSet<Tournament> Tournaments { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<NewsItem> NewsItems { get; set; } = null!;
    public DbSet<Registration> Registrations { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure JSONB columns for Tournament (Npgsql specific types removed for In-Memory test compatibility)
        modelBuilder.Entity<Tournament>().Property(b => b.SetupProperties);
        modelBuilder.Entity<Tournament>().Property(b => b.SetupPropertiesMap);
        modelBuilder.Entity<Tournament>().Property(b => b.FinalPlacements);
        modelBuilder.Entity<Tournament>().Property(b => b.RegisteredPlayerIds);
    }
}
