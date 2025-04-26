//package com.example.Toros.service.news;
//
//import com.example.Toros.model.NewsItem;
//import com.example.Toros.repository.NewsRepository;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//import org.springframework.web.reactive.function.client.WebClient;
//import reactor.core.publisher.Flux;
//import reactor.core.scheduler.Schedulers;
//
//import java.util.List;
//
//@Component
//public class RssAggregator {
//    private final NewsRepository repo;
//    private final NewsCacheService cache;
//    private final WebClient web = WebClient.create();
//
//    // your list of external RSS/Atom URLs
//    private final List<String> feeds = List.of(
//            "https://ppatour.com/feed",
//            "https://pickleballqueensland.org/news/feed",
//            "https://rss.reuters.com/reuters/sportsPickleball"
//    );
//
//    public RssAggregator(NewsRepository repo, NewsCacheService cache) {
//        this.repo  = repo;
//        this.cache = cache;
//    }
//
//    /**
//     * Every 10 minutes: fetch each RSS feed, parse into NewsItem,
//     * drop any whose link already exists in Mongo, then save+cache the rest.
//     */
//    @Scheduled(fixedRate = 600_000)
//    public void fetchFeeds() {
//        for (String url : feeds) {
//            web.get()
//                    .uri(url)
//                    .retrieve()
//                    .bodyToMono(String.class)
//                    // parse raw XML → List<NewsItem>
//                    .map(RssUtils::parse)
//                    // flatten to Flux<NewsItem>
//                    .flatMapMany(Flux::fromIterable)
//                    .publishOn(Schedulers.boundedElastic())
//                    // skip ones already in Mongo (by link)
//                    .filter(item -> repo.findByLink(item.getLink()).isEmpty())
//                    // for each new item: save to Mongo and push to Redis
//                    .subscribe(item -> {
//                        NewsItem saved = repo.save(item);
//                        cache.push(saved);
//                    }, err -> {
//                        // log & continue on error
//                        System.err.println("Failed to fetch/parse RSS [" + url + "]: " + err.getMessage());
//                    });
//        }
//    }
//}
