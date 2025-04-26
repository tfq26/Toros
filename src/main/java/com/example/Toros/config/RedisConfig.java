//package com.example.Toros.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import com.example.Toros.model.NewsItem;                             // ← your model
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
//import org.springframework.data.redis.serializer.StringRedisSerializer;
//
//@Configuration
//public class RedisConfig {
//    @Bean
//    public LettuceConnectionFactory redisConnectionFactory() {
//        return new LettuceConnectionFactory(); // localhost:6379 by default
//    }
//
//    @Bean
//    public RedisTemplate<String, NewsItem> redisTemplate(LettuceConnectionFactory cf) {
//        RedisTemplate<String, NewsItem> tpl = new RedisTemplate<>();
//        tpl.setConnectionFactory(cf);
//        tpl.setKeySerializer(new StringRedisSerializer());
//        Jackson2JsonRedisSerializer<NewsItem> ser =
//                new Jackson2JsonRedisSerializer<>(NewsItem.class);
//        tpl.setValueSerializer(ser);
//        return tpl;
//    }
//}
//
