package com.example.Toros.controller;

import com.example.Toros.model.NewsItem;
import com.example.Toros.service.news.MongoNewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

/**
 * REST controller for managing news articles.
 */
@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsController {

    private final MongoNewsService newsService;

    public NewsController(MongoNewsService newsService) {
        this.newsService = newsService;
    }

    /**
     * GET  /api/news
     * Fetch the most recent news items or filter by category if provided.
     */
    @GetMapping
    public ResponseEntity<List<NewsItem>> getLatest(
            @RequestParam(value = "category", required = false) String category) {
        List<NewsItem> items;
        if (category != null && !category.isBlank()) {
            items = newsService.getByCategory(category);
        } else {
            items = newsService.getLatest(50);
        }
        return ResponseEntity.ok(items);
    }

    /**
     * GET  /api/news/{id}
     * Fetch a single news item by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<NewsItem> getById(@PathVariable String id) {
        return newsService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/news
     * Create a new NewsItem, including optional coverImageUrl.
     */
    @PostMapping
    public ResponseEntity<NewsItem> create(@RequestBody NewsItem item) {
        NewsItem saved = newsService.save(item);
        URI location = URI.create("/api/news/" + saved.getId());
        return ResponseEntity.created(location).body(saved);
    }

    /**
     * DELETE /api/news/{id}
     * Remove an existing news item (optional).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (newsService.deleteById(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
