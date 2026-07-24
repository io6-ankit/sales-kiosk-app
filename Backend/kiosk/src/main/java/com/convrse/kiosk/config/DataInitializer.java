package com.convrse.kiosk.config;

import com.convrse.kiosk.model.Booking;
import com.convrse.kiosk.model.Tower;
import com.convrse.kiosk.model.Unit;
import com.convrse.kiosk.repository.BookingRepository;
import com.convrse.kiosk.repository.TowerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initMockDatabase(TowerRepository towerRepository, BookingRepository bookingRepository) {
        return args -> {
            // Check if towers exist, if not insert default data
            if (towerRepository.count() == 0) {
                // Tower A Data
                List<Unit> unitsA = new ArrayList<>();
                unitsA.add(new Unit("101", true, "Rahul Sharma", 150000.0));
                unitsA.add(new Unit("102", false, null, 160000.0));
                unitsA.add(new Unit("103", true, "John Doe", 170000.0));
                unitsA.add(new Unit("104", false, null, 180000.0));
                Tower towerA = towerRepository.save(new Tower(null, "Tower A", unitsA));

                // Tower B Data
                List<Unit> unitsB = new ArrayList<>();
                unitsB.add(new Unit("201", false, null, 200000.0));
                unitsB.add(new Unit("202", true, "Sarah Jenkins", 210000.0));
                unitsB.add(new Unit("203", false, null, 220000.0));
                unitsB.add(new Unit("204", false, null, 230000.0));
                Tower towerB = towerRepository.save(new Tower(null, "Tower B", unitsB));

                // Tower C Data
                List<Unit> unitsC = new ArrayList<>();
                unitsC.add(new Unit("301", false, null, 250000.0));
                unitsC.add(new Unit("302", false, null, 260000.0));
                unitsC.add(new Unit("303", false, null, 270000.0));
                Tower towerC = towerRepository.save(new Tower(null, "Tower C", unitsC));

                // Insert Pre-filled Bookings for GET /api/bookings
                if (bookingRepository.count() == 0) {
                    Booking booking1 = new Booking(towerA.getId(), "101", "Rahul Sharma", "9876543210");
                    booking1.setTimestamp(LocalDateTime.now().minusDays(2));

                    Booking booking2 = new Booking(towerA.getId(), "103", "John Doe", "9123456789");
                    booking2.setTimestamp(LocalDateTime.now().minusDays(1));

                    Booking booking3 = new Booking(towerB.getId(), "202", "Sarah Jenkins", "9988776655");
                    booking3.setTimestamp(LocalDateTime.now());

                    bookingRepository.save(booking1);
                    bookingRepository.save(booking2);
                    bookingRepository.save(booking3);
                }

                System.out.println("=============================================");
                System.out.println(">>> MOCK DATA INITIALIZED IN MONGODB SUCCESS!");
                System.out.println("=============================================");
            }
        };
    }
}