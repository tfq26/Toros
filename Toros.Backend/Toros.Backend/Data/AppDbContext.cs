using Microsoft.EntityFrameworkCore;
using Toros.Backend.Models;

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
    public DbSet<NewsItem> News { get; set; } = null!;
    public DbSet<Registration> Registrations { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure JSONB columns for Tournament
        modelBuilder.Entity<Tournament>()
            .Property(b => b.SetupProperties)
            .HasColumnType("jsonb");

        modelBuilder.Entity<Tournament>()
            .Property(b => b.SetupPropertiesMap)
            .HasColumnType("jsonb");

        modelBuilder.Entity<Tournament>()
            .Property(b => b.FinalPlacements)
            .HasColumnType("jsonb");

        // Additional configurations (indexes, relationships) can be added here
    }
}
