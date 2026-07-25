package com.convrse.kiosk.repository;

import com.convrse.kiosk.model.Tower;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TowerRepository extends MongoRepository<Tower, String> {

    // Retained existing method for backward compatibility
    Optional<Tower> findByName(String name);

    // Case-insensitive search for flexible tower lookups
    Optional<Tower> findByNameIgnoreCase(String name);
}