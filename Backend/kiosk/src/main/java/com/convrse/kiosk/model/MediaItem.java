package com.convrse.kiosk.model;

public class MediaItem {
    private String id;
    private String title;
    private String type; // "IMAGE" or "VIDEO"
    private String url;
    private String description;

    // Default Constructor
    public MediaItem() {
    }

    // All Arguments Constructor
    public MediaItem(String id, String title, String type, String url, String description) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.url = url;
        this.description = description;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}