package com.convrse.kiosk.service;

import com.convrse.kiosk.dto.BookingRequest;
import com.convrse.kiosk.exception.ResourceNotFoundException;
import com.convrse.kiosk.exception.UnitAlreadyBookedException;
import com.convrse.kiosk.model.Booking;
import com.convrse.kiosk.model.SyncMessage;
import com.convrse.kiosk.model.Tower;
import com.convrse.kiosk.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // GET
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    // POST (Atomic Reservation)
    public synchronized Booking bookUnit(BookingRequest request) {
        Query query = new Query(Criteria.where("id").is(request.getTowerId())
                .and("units").elemMatch(Criteria.where("unitNumber").is(request.getUnitNumber())
                        .and("booked").is(false)));

        Update update = new Update()
                .set("units.$.booked", true)
                .set("units.$.bookedBy", request.getCustomerName());

        Tower updatedTower = mongoTemplate.findAndModify(query, update, Tower.class);

        if (updatedTower == null) {
            throw new UnitAlreadyBookedException("Unit " + request.getUnitNumber() + " is already booked or does not exist.");
        }

        Booking booking = new Booking(request.getTowerId(), request.getUnitNumber(), request.getCustomerName(), request.getPhoneNumber());
        Booking savedBooking = bookingRepository.save(booking);

        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("INVENTORY_UPDATE", savedBooking, "SERVER"));

        return savedBooking;
    }

    // PUT (Full Replacement of Booking Record)
    public Booking updateBooking(String id, Booking updatedBooking) {
        Booking existing = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        existing.setTowerId(updatedBooking.getTowerId());
        existing.setUnitNumber(updatedBooking.getUnitNumber());
        existing.setCustomerName(updatedBooking.getCustomerName());
        existing.setPhoneNumber(updatedBooking.getPhoneNumber());

        return bookingRepository.save(existing);
    }

    // PATCH (Partial Update of Customer details or Unit)
    public Booking patchBooking(String id, Map<String, Object> updates) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (updates.containsKey("customerName")) {
            booking.setCustomerName((String) updates.get("customerName"));
        }
        if (updates.containsKey("phoneNumber")) {
            booking.setPhoneNumber((String) updates.get("phoneNumber"));
        }
        if (updates.containsKey("unitNumber")) {
            booking.setUnitNumber((String) updates.get("unitNumber"));
        }
        if (updates.containsKey("towerId")) {
            booking.setTowerId((String) updates.get("towerId"));
        }

        return bookingRepository.save(booking);
    }

    // DELETE (Cancel/Remove Booking & Release Unit)
    public void deleteBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        // Release the reserved unit inside Tower document
        Query query = new Query(Criteria.where("id").is(booking.getTowerId())
                .and("units.unitNumber").is(booking.getUnitNumber()));

        Update update = new Update()
                .set("units.$.booked", false)
                .set("units.$.bookedBy", null);

        mongoTemplate.updateFirst(query, update, Tower.class);

        bookingRepository.deleteById(id);

        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("BOOKING_CANCELLED", id, "SERVER"));
    }
}