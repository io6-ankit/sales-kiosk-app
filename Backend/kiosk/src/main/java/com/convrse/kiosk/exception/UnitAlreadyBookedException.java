package com.convrse.kiosk.exception;

public class UnitAlreadyBookedException extends RuntimeException {
    public UnitAlreadyBookedException(String message) {
        super(message);
    }
}