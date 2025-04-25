package com.example.Toros.repository;

import com.example.Toros.model.NewsItem;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface NewsRepository extends MongoRepository<NewsItem,String> {


}
