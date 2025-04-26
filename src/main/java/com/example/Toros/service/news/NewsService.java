package com.example.Toros.service.news;

import com.example.Toros.model.NewsItem;
import java.util.List;
import java.util.Optional;

/**
 * Service interface defining operations for managing news items.
 */
public interface NewsService {

    /**
     * Fetch the most recent news items up to the provided limit.
     * @param limit maximum number of items to retrieve
     * @return list of latest news items
     */
    List<NewsItem> getLatest(int limit);

    /**
     * Fetch news items by their category, ordered by publication date descending.
     * @param category the category to filter by
     * @return list of matching news items
     */
    List<NewsItem> getByCategory(String category);

    /**
     * Fetch a single news item by its unique ID.
     * @param id the identifier of the news item
     * @return Optional containing the news item if found, or empty otherwise
     */
    Optional<NewsItem> getById(String id);

    /**
     * Save or update a news item.
     * @param item the news item to persist
     * @return the saved news item
     */
    NewsItem save(NewsItem item);

    /**
     * Delete a news item by its unique ID.
     * @param id the identifier of the item to delete
     * @return true if deletion was successful, false if not found
     */
    boolean deleteById(String id);
}
