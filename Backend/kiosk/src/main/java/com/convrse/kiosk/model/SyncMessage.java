package com.convrse.kiosk.model;

public class SyncMessage {
    private String type;      // e.g., INVENTORY_UPDATE, TAB_CHANGE
    private Object payload;
    private String senderId;  // Client identifier

    public SyncMessage() {
    }

    public SyncMessage(String type, Object payload, String senderId) {
        this.type = type;
        this.payload = payload;
        this.senderId = senderId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }
}