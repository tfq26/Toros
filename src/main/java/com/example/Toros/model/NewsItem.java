package com.example.Toros.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

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
}
