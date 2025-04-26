//package com.example.Toros.service.news;
//
//import com.example.Toros.model.NewsItem;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class NewsCacheService {
//    private static final String KEY = "news:latest";
//    private static final int MAX  = 50;
//
//    private final RedisTemplate<String, NewsItem> redisTemplate;
//
//    public NewsCacheService(RedisTemplate<String, NewsItem> redisTemplate) {
//        this.redisTemplate = redisTemplate;
//    }
//
//    /**
//     * Push a new NewsItem onto the front of the list and trim to MAX entries.
//     */
//    public void push(NewsItem item) {
//        redisTemplate.opsForList().leftPush(KEY, item);
//        redisTemplate.opsForList().trim(KEY, 0, MAX - 1);
//    }
//
//    /**
//     * Return up to MAX of the most-recent NewsItems.
//     */
//    public List<NewsItem> latest() {
//        return redisTemplate.opsForList().range(KEY, 0, MAX - 1);
//    }
//}
