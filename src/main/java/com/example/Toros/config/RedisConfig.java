package com.example.Toros.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RedisConfig {
    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(); // localhost:6379 by default
    }

    @Bean
    public RedisTemplate<String, NewsItem> redisTemplate(LettuceConnectionFactory cf) {
        RedisTemplate<String, NewsItem> tpl = new RedisTemplate<>();
        tpl.setConnectionFactory(cf);
        tpl.setKeySerializer(new StringRedisSerializer());
        Jackson2JsonRedisSerializer<NewsItem> ser =
                new Jackson2JsonRedisSerializer<>(NewsItem.class);
        tpl.setValueSerializer(ser);
        return tpl;
    }
}

