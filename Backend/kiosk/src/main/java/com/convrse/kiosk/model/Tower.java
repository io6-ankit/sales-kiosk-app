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

    public Tower() {
    }

    public Tower(String id, String name, List<Unit> units) {
        this.id = id;
        this.name = name;
        this.units = units;
    }

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
}