package com.example.Toros.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Represents a news article in the Toros application.
 */
@Data
@Document(collection = "news")
public class NewsItem {

    private String id;
    private String title;
    private String summary;
    private String link;
    private String category;      // e.g. "local", "major", "equipment", "app"
    private Instant publishedAt;
    private String source;

    /**
     * Optional URL for a cover image to display alongside the article.
     */
    private String coverImageUrl;
}
