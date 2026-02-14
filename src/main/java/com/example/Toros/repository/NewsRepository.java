package com.example.Toros.repository;

import com.example.Toros.model.NewsItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface NewsRepository extends JpaRepository<NewsItem, String> {

    /**
     * Find a specific item by its canonical link.
     */
    Optional<NewsItem> findByLink(String link);

    /**
     * Check existence by link for deduplication.
     */
    boolean existsByLink(String link);

    /**
     * Retrieve all items for a given category.
     */
    List<NewsItem> findByCategory(String category);

    /**
     * Retrieve all items for a given category sorted by published date descending.
     */
    List<NewsItem> findByCategoryOrderByPublishedAtDesc(String category);

    /**
     * Retrieve all items sorted by published date descending.
     */
    List<NewsItem> findAllByOrderByPublishedAtDesc();

    /**
     * Retrieve the top 50 items sorted by published date descending.
     * Spring Data interprets 'Top50' as a query limit of 50.
     */
    List<NewsItem> findTop50ByOrderByPublishedAtDesc();

    /**
     * Retrieve items published after the specified instant, sorted descending.
     */
    List<NewsItem> findByPublishedAtAfterOrderByPublishedAtDesc(Instant since);

    /**
     * Count items in a category.
     */
    long countByCategory(String category);

    /**
     * Delete items older than the specified instant.
     */
    long deleteByPublishedAtBefore(Instant cutoff);
}
