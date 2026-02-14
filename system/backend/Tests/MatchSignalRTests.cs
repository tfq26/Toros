using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Toros.Backend.Data;
using Toros.Backend.Hubs;
using Toros.Backend.Services;
using Toros.Common.Models;
using Xunit;

namespace Toros.Backend.Tests
{
    public class MatchSignalRTests
    {
        [Fact]
        public async Task UpdateMatchScore_Should_BroadcastToSignalR()
        {
            // Arrange
            var serviceProvider = new ServiceCollection()
                .AddLogging()
                .AddEntityFrameworkInMemoryDatabase()
                .BuildServiceProvider();

            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb")
                .UseInternalServiceProvider(serviceProvider)
                .Options;

            using var context = new AppDbContext(options);
            
            var mockHubContext = new Mock<IHubContext<MatchHub>>();
            var mockGroups = new Mock<IHubClients>();
            var mockGroupProxy = new Mock<IClientProxy>();
            
            mockHubContext.Setup(hub => hub.Clients).Returns(mockGroups.Object);
            mockGroups.Setup(groups => groups.Group(It.IsAny<string>())).Returns(mockGroupProxy.Object);
            
            var mockLogger = new Mock<ILogger<MatchService>>();

            var matchService = new MatchService(context, mockHubContext.Object, mockLogger.Object);

            var team1 = new Team { Id = "team-1", Name = "Team 1", TournamentId = "tourney-1" };
            var team2 = new Team { Id = "team-2", Name = "Team 2", TournamentId = "tourney-1" };
            
            context.Teams.Add(team1);
            context.Teams.Add(team2);
            await context.SaveChangesAsync();

            var match = new Toros.Common.Models.Match
            {
                Id = "match-1",
                TournamentId = "tourney-1",
                Team1Id = "team-1",
                Team2Id = "team-2",
                Team1Score = 0,
                Team2Score = 0,
                Status = "ONGOING",
                StartTime = DateTime.UtcNow
            };
            context.Matches.Add(match);
            await context.SaveChangesAsync();

            // Act
            await matchService.UpdateMatchScoreAsync("match-1", 11, 5);

            // Assert
            mockGroupProxy.Verify(
                client => client.SendCoreAsync(
                    "ScoreUpdated",
                    It.IsAny<object[]>(),
                    default),
                Times.AtLeastOnce);
        }
    }
}
