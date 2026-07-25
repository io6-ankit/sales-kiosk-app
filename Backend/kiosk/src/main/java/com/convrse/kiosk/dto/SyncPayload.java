package com.convrse.kiosk.dto;

public class SyncPayload {
    private String action;      // e.g., "OPEN_PREVIEW", "PLAY_VIDEO", "CHANGE_TAB", "SELECT_TOWER"
    private String targetId;    // e.g., Image ID, Video URL, Tower ID, Unit Number
    private Object data;        // Extra metadata (if any)

    // Default Constructor
    public SyncPayload() {
    }

    // Constructor without data
    public SyncPayload(String action, String targetId) {
        this.action = action;
        this.targetId = targetId;
    }

    // All Arguments Constructor
    public SyncPayload(String action, String targetId, Object data) {
        this.action = action;
        this.targetId = targetId;
        this.data = data;
    }

    // Getters and Setters
    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "SyncPayload{" +
                "action='" + action + '\'' +
                ", targetId='" + targetId + '\'' +
                ", data=" + data +
                '}';
    }
}