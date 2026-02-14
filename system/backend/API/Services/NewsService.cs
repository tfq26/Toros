using Microsoft.EntityFrameworkCore;
using Toros.Backend.Data;
using Toros.Backend.Interfaces;
using Toros.Common.Models;

namespace Toros.Backend.Services;

public class NewsService : INewsService
{
    private readonly AppDbContext _context;

    public NewsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<NewsItem>> GetLatestNewsAsync(int limit)
    {
        return await _context.NewsItems
            .OrderByDescending(n => n.PublishedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<NewsItem>> GetNewsByCategoryAsync(string category)
    {
        return await _context.NewsItems
            .Where(n => n.Category == category)
            .OrderByDescending(n => n.PublishedAt)
            .ToListAsync();
    }

    public async Task<NewsItem?> GetNewsByIdAsync(string id)
    {
        return await _context.NewsItems.FindAsync(id);
    }

    public async Task<NewsItem> SaveNewsItemAsync(NewsItem item)
    {
        if (string.IsNullOrEmpty(item.Id))
        {
            _context.NewsItems.Add(item);
        }
        else
        {
            _context.Entry(item).State = EntityState.Modified;
        }

        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<bool> DeleteNewsItemAsync(string id)
    {
        var item = await _context.NewsItems.FindAsync(id);
        if (item == null) return false;

        _context.NewsItems.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}
