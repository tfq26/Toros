package com.example.Toros.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(name = "news")
@Data
public class NewsItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    private String link;
    private String category; // e.g. "local", "major", "equipment", "app"
    private Instant publishedAt;
    private String source;

    /**
     * Optional URL for a cover image to display alongside the article.
     */
    private String coverImageUrl;
}
