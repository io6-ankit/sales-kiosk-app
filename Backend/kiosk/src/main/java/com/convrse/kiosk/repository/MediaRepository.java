package com.convrse.kiosk.repository;

import com.convrse.kiosk.model.MediaItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends MongoRepository<MediaItem, String> {
    List<MediaItem> findByType(String type);
}