package com.convrse.kiosk.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "towers")
public class Tower {

    @Id
    private String id;
    private String name;
    private List<Unit> units;

    // Default Constructor (Required by Jackson & Spring Data)
    public Tower() {
    }

    // Constructor without ID (Best for creating new items where MongoDB auto-generates the ID)
    public Tower(String name, List<Unit> units) {
        this.name = name;
        this.units = units;
    }

    // All Arguments Constructor (Retained for existing functionality)
    public Tower(String id, String name, List<Unit> units) {
        this.id = id;
        this.name = name;
        this.units = units;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Unit> getUnits() {
        return units;
    }

    public void setUnits(List<Unit> units) {
        this.units = units;
    }

    @Override
    public String toString() {
        return "Tower{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", units=" + units +
                '}';
    }
}