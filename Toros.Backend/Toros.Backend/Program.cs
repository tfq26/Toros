using Microsoft.EntityFrameworkCore;
using Toros.Backend.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITeamService, TeamService>();
builder.Services.AddScoped<ITournamentSetupService, TournamentSetupService>();
builder.Services.AddScoped<ITournamentService, TournamentService>();
builder.Services.AddScoped<IMatchService, MatchService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<INewsService, NewsService>();

builder.Services.AddHttpClient();
builder.Services.AddSignalR();

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapHub<MatchHub>("/matchHub");

app.Run();
