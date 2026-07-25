package com.convrse.kiosk.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "gallery")
public class MediaItem {

    @Id
    private String id;
    private String title;
    private String type; // "IMAGE" or "VIDEO"
    private String url;
    private String description;

    // Default Constructor (Required by Jackson & Spring Data)
    public MediaItem() {
    }

    // Constructor without ID (Best for creating new items where MongoDB auto-generates the ID)
    public MediaItem(String title, String type, String url, String description) {
        this.title = title;
        this.type = type;
        this.url = url;
        this.description = description;
    }

    // All Arguments Constructor (Retained for existing functionality)
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

    @Override
    public String toString() {
        return "MediaItem{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", type='" + type + '\'' +
                ", url='" + url + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}