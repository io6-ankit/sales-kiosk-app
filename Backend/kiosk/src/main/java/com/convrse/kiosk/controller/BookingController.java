package com.convrse.kiosk.controller;

import com.convrse.kiosk.dto.BookingRequest;
import com.convrse.kiosk.exception.ResourceNotFoundException;
import com.convrse.kiosk.model.Booking;
import com.convrse.kiosk.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // GET ALL
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // GET BY ID
    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Booking record not found with id: " + id));
    }

    // POST (CREATE BOOKING)
    @PostMapping("/book")
    public ResponseEntity<Booking> bookUnit(@RequestBody BookingRequest request) {
        Booking booking = bookingService.bookUnit(request);
        return ResponseEntity.ok(booking);
    }

    // PUT (REPLACE BOOKING DETAILS)
    @PutMapping("/bookings/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable String id, @RequestBody Booking booking) {
        Booking updated = bookingService.updateBooking(id, booking);
        return ResponseEntity.ok(updated);
    }

    // PATCH (PARTIAL UPDATE BOOKING DETAILS)
    @PatchMapping("/bookings/{id}")
    public ResponseEntity<Booking> patchBooking(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Booking patched = bookingService.patchBooking(id, updates);
        return ResponseEntity.ok(patched);
    }

    // DELETE (CANCEL BOOKING & RELEASE UNIT)
    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Map<String, String>> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(Map.of("message", "Booking with id " + id + " cancelled and unit released successfully."));
    }
}