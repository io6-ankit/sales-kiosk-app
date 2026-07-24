package com.convrse.kiosk.dto;

public class BookingRequest {
    private String towerId;
    private String unitNumber;
    private String customerName;
    private String phoneNumber;

    public BookingRequest() {
    }

    public BookingRequest(String towerId, String unitNumber, String customerName, String phoneNumber) {
        this.towerId = towerId;
        this.unitNumber = unitNumber;
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;
    }

    public String getTowerId() {
        return towerId;
    }

    public void setTowerId(String towerId) {
        this.towerId = towerId;
    }

    public String getUnitNumber() {
        return unitNumber;
    }

    public void setUnitNumber(String unitNumber) {
        this.unitNumber = unitNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}