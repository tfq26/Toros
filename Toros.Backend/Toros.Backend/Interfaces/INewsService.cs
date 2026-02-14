using Toros.Backend.Models;

namespace Toros.Backend.Interfaces;

public interface INewsService
{
    Task<List<NewsItem>> GetLatestNewsAsync(int limit);
    Task<List<NewsItem>> GetNewsByCategoryAsync(string category);
    Task<NewsItem?> GetNewsByIdAsync(string id);
    Task<NewsItem> SaveNewsItemAsync(NewsItem item);
    Task<bool> DeleteNewsItemAsync(string id);
}
