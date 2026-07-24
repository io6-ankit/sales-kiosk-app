package com.convrse.kiosk.repository;

import com.convrse.kiosk.model.Tower;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface TowerRepository extends MongoRepository<Tower, String> {
    Optional<Tower> findByName(String name);
}