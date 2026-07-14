using Microsoft.EntityFrameworkCore;
using Toros.Backend.Data;
using Toros.Backend.Interfaces;
using Toros.Backend.Services;
using Toros.Backend.Hubs;
using Toros.Common.Models;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpClient();
builder.Services.AddSignalR();

// WorkOS Initialization
builder.Services.AddHttpClient<WorkOSUserManagementService>();

// Service Registration
// Service Registration
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITeamService, TeamService>();
builder.Services.AddScoped<ITournamentService, TournamentService>();
builder.Services.AddScoped<ITournamentSetupService, TournamentSetupService>();
builder.Services.AddScoped<IStageService, StageService>();
builder.Services.AddScoped<IMatchService, MatchService>();
builder.Services.AddScoped<INewsService, NewsService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        Console.WriteLine("✅ JSON Serializer configured with ReferenceHandler.IgnoreCycles");
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapHub<MatchHub>("/matchHub");

// Apply migrations on startup (temporarily disabled)
// using (var scope = app.Services.CreateScope())
// {
//     var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//     dbContext.Database.Migrate();
// }

app.Run();
