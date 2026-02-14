using Microsoft.AspNetCore.Mvc;
using Toros.Backend.Interfaces;
using Toros.Backend.Models;

namespace Toros.Backend.Controllers;

[ApiController]
[Route("api/news")]
public class NewsController : ControllerBase
{
    private readonly INewsService _newsService;

    public NewsController(INewsService newsService)
    {
        _newsService = newsService;
    }

    [HttpGet("latest")]
    public async Task<IActionResult> GetLatest([FromQuery] int limit = 10)
    {
        var news = await _newsService.GetLatestNewsAsync(limit);
        return Ok(news);
    }

    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetByCategory(string category)
    {
        var news = await _newsService.GetNewsByCategoryAsync(category);
        return Ok(news);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var news = await _newsService.GetNewsByIdAsync(id);
        return news != null ? Ok(news) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] NewsItem item)
    {
        var saved = await _newsService.SaveNewsItemAsync(item);
        return CreatedAtAction(nameof(GetById), new { id = saved.Id }, saved);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _newsService.DeleteNewsItemAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
