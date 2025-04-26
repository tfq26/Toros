//package com.example.Toros.service.news;
//
//import com.example.Toros.model.NewsItem;
//import com.rometools.rome.feed.synd.SyndEntry;
//import com.rometools.rome.feed.synd.SyndFeed;
//import com.rometools.rome.io.SyndFeedInput;
//
//import java.io.StringReader;
//import java.time.Instant;
//import java.util.List;
//import java.util.stream.Collectors;
//
//public class RssUtils {
//
//    /**
//     * Parse raw RSS/Atom XML into a List<NewsItem>.
//     */
//    public static List<NewsItem> parse(String xml) {
//        try {
//            SyndFeedInput input = new SyndFeedInput();
//            SyndFeed feed = input.build(new StringReader(xml));
//            String sourceTitle = feed.getTitle();          // ← use the feed’s title
//
//            // Map each entry, passing along the feed title as source
//            return feed.getEntries().stream()
//                    .map(entry -> toNewsItem(entry, sourceTitle))
//                    .collect(Collectors.toList());
//
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to parse RSS feed", e);
//        }
//    }
//
//    private static NewsItem toNewsItem(SyndEntry entry, String sourceTitle) {
//        NewsItem item = new NewsItem();
//        item.setTitle(entry.getTitle());
//        item.setSummary(entry.getDescription() != null
//                ? entry.getDescription().getValue()
//                : "");
//        item.setLink(entry.getLink());
//        item.setSource(sourceTitle);                    // ← set from feed.getTitle()
//        item.setPublishedAt(entry.getPublishedDate() != null
//                ? entry.getPublishedDate().toInstant()
//                : Instant.now());
//        item.setCategory("major");                      // you can adjust this logic
//        return item;
//    }
//}
