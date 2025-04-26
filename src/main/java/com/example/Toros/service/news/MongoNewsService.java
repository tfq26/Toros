package com.example.Toros.service.news;

import com.example.Toros.model.NewsItem;
import com.example.Toros.repository.NewsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * MongoDB-backed implementation of NewsService.
 */
@Service
public class MongoNewsService implements NewsService {
    private final NewsRepository repo;

    public MongoNewsService(NewsRepository repo) {
        this.repo = repo;
    }

    /**
     * Fetch the most recent news items up to the given limit.
     */
    @Override
    public List<NewsItem> getLatest(int limit) {
        return repo.findAllByOrderByPublishedAtDesc()
                .stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Fetch news items by category, ordered by published date descending.
     */
    @Override
    public List<NewsItem> getByCategory(String category) {
        return repo.findByCategoryOrderByPublishedAtDesc(category);
    }

    /**
     * Fetch a single news item by its ID.
     */
    @Override
    public Optional<NewsItem> getById(String id) {
        return repo.findById(id);
    }

    /**
     * Save or update a news item.
     */
    @Override
    public NewsItem save(NewsItem item) {
        return repo.save(item);
    }

    /**
     * Delete a news item by its ID.
     * @return true if deleted, false if not found
     */
    @Override
    public boolean deleteById(String id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}
