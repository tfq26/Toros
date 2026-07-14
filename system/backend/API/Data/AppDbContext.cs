using Microsoft.EntityFrameworkCore;
using Toros.Common.Models;

namespace Toros.Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Team> Teams { get; set; } = null!;
    public DbSet<Match> Matches { get; set; } = null!;
    public DbSet<Tournament> Tournaments { get; set; } = null!;
    public DbSet<TournamentPlayer> TournamentPlayers { get; set; } = null!; // New
    public DbSet<TournamentStage> TournamentStages { get; set; } = null!;   // New
    public DbSet<TournamentGroup> TournamentGroups { get; set; } = null!;   // New
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<NewsItem> NewsItems { get; set; } = null!;
    public DbSet<Registration> Registrations { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User -> Team relationships (Restrict deletion)
        modelBuilder.Entity<Team>()
            .HasOne(t => t.Player1)
            .WithMany()
            .HasForeignKey(t => t.Player1Id)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Team>()
            .HasOne(t => t.Player2)
            .WithMany()
            .HasForeignKey(t => t.Player2Id)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Match -> Team relationships (Restrict deletion)
        modelBuilder.Entity<Match>()
            .HasOne(m => m.Team1)
            .WithMany()
            .HasForeignKey(m => m.Team1Id)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Match>()
            .HasOne(m => m.Team2)
            .WithMany()
            .HasForeignKey(m => m.Team2Id)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure JSONB columns for Tournament (Npgsql specific types removed for In-Memory test compatibility)
        // Properties removed in refactor
    }
}
