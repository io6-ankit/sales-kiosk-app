package com.convrse.kiosk.service;

import com.convrse.kiosk.exception.ResourceNotFoundException;
import com.convrse.kiosk.model.Tower;
import com.convrse.kiosk.model.Unit;
import com.convrse.kiosk.repository.TowerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private TowerRepository towerRepository;

    // GET
    public List<Tower> getAllTowers() {
        return towerRepository.findAll();
    }

    public Optional<Tower> getTowerById(String id) {
        return towerRepository.findById(id);
    }

    // POST
    public Tower saveTower(Tower tower) {
        return towerRepository.save(tower);
    }

    // PUT (Complete Replacement)
    public Tower updateTower(String id, Tower updatedTower) {
        Tower existingTower = towerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tower not found with id: " + id));
        existingTower.setName(updatedTower.getName());
        existingTower.setUnits(updatedTower.getUnits());
        return towerRepository.save(existingTower);
    }

    // PATCH (Partial Update - Tower Name or Specific Units)
    public Tower patchTower(String id, Map<String, Object> updates) {
        Tower tower = towerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tower not found with id: " + id));

        if (updates.containsKey("name")) {
            tower.setName((String) updates.get("name"));
        }
        return towerRepository.save(tower);
    }

    // DELETE
    public void deleteTower(String id) {
        if (!towerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tower not found with id: " + id);
        }
        towerRepository.deleteById(id);
    }

    // Sub-Resource: PATCH Unit status inside a Tower
    public Tower patchUnitStatus(String towerId, String unitNumber, Map<String, Object> updates) {
        Tower tower = towerRepository.findById(towerId)
                .orElseThrow(() -> new ResourceNotFoundException("Tower not found with id: " + towerId));

        boolean found = false;
        for (Unit unit : tower.getUnits()) {
            if (unit.getUnitNumber().equalsIgnoreCase(unitNumber)) {
                if (updates.containsKey("booked")) {
                    unit.setBooked((Boolean) updates.get("booked"));
                }
                if (updates.containsKey("bookedBy")) {
                    unit.setBookedBy((String) updates.get("bookedBy"));
                }
                if (updates.containsKey("price")) {
                    unit.setPrice(Double.parseDouble(updates.get("price").toString()));
                }
                found = true;
                break;
            }
        }

        if (!found) {
            throw new ResourceNotFoundException("Unit " + unitNumber + " not found in Tower id: " + towerId);
        }

        return towerRepository.save(tower);
    }
}