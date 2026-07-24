package com.convrse.kiosk.model;

public class Unit {
    private String unitNumber;
    private boolean booked;
    private String bookedBy;
    private double price;

    // Default Constructor
    public Unit() {
    }

    // All Arguments Constructor
    public Unit(String unitNumber, boolean booked, String bookedBy, double price) {
        this.unitNumber = unitNumber;
        this.booked = booked;
        this.bookedBy = bookedBy;
        this.price = price;
    }

    // Getters and Setters
    public String getUnitNumber() {
        return unitNumber;
    }

    public void setUnitNumber(String unitNumber) {
        this.unitNumber = unitNumber;
    }

    public boolean isBooked() {
        return booked;
    }

    public void setBooked(boolean booked) {
        this.booked = booked;
    }

    public String getBookedBy() {
        return bookedBy;
    }

    public void setBookedBy(String bookedBy) {
        this.bookedBy = bookedBy;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}