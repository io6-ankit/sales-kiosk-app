package com.convrse.kiosk.repository;

import com.convrse.kiosk.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // Find all bookings for a specific tower
    List<Booking> findByTowerId(String towerId);

    // Check if a specific unit is already booked in a tower
    boolean existsByTowerIdAndUnitNumber(String towerId, String unitNumber);
}