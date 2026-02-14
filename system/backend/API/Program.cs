using Microsoft.EntityFrameworkCore;
using Toros.Backend.Data;
using Toros.Backend.Interfaces;
using Toros.Backend.Services;
using Toros.Backend.Hubs;
using Toros.Common.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpClient();
builder.Services.AddSignalR();

// WorkOS Initialization
WorkOS.WorkOS.ApiKey = builder.Configuration["WorkOS:ApiKey"];
builder.Services.AddScoped<UserManagementService>();

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapHub<MatchHub>("/matchHub");

app.Run();
