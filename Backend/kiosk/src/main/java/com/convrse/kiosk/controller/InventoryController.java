package com.convrse.kiosk.controller;

import com.convrse.kiosk.exception.ResourceNotFoundException;
import com.convrse.kiosk.model.SyncMessage;
import com.convrse.kiosk.model.Tower;
import com.convrse.kiosk.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // ✅ WEBSOCKET BROADCASTER ADDED

    // GET ALL
    @GetMapping("/inventory")
    public ResponseEntity<List<Tower>> getInventory() {
        return ResponseEntity.ok(inventoryService.getAllTowers());
    }

    // GET BY ID
    @GetMapping("/inventory/tower/{id}")
    public ResponseEntity<Tower> getTowerById(@PathVariable String id) {
        return inventoryService.getTowerById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Tower not found with id: " + id));
    }

    // POST (CREATE)
    @PostMapping("/inventory/tower")
    public ResponseEntity<Tower> addTower(@RequestBody Tower tower) {
        tower.setId(null); // ✅ FIX: Prevents null/invalid id issue for Mongo auto-generation
        Tower savedTower = inventoryService.saveTower(tower);

        // 🔥 Broadcast real-time event to SockJS subscribers
        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("INVENTORY_ADD", savedTower, "SERVER"));

        return ResponseEntity.ok(savedTower);
    }

    // PUT (FULL UPDATE)
    @PutMapping("/inventory/tower/{id}")
    public ResponseEntity<Tower> updateTower(@PathVariable String id, @RequestBody Tower tower) {
        Tower updated = inventoryService.updateTower(id, tower);

        // 🔥 Broadcast update event
        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("INVENTORY_UPDATE", updated, "SERVER"));

        return ResponseEntity.ok(updated);
    }

    // PATCH (PARTIAL TOWER UPDATE)
    @PatchMapping("/inventory/tower/{id}")
    public ResponseEntity<Tower> patchTower(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Tower patched = inventoryService.patchTower(id, updates);

        // 🔥 Broadcast patch event
        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("INVENTORY_UPDATE", patched, "SERVER"));

        return ResponseEntity.ok(patched);
    }

    // PATCH SUB-RESOURCE (PARTIAL UNIT STATUS UPDATE)
    @PatchMapping("/inventory/tower/{towerId}/unit/{unitNumber}")
    public ResponseEntity<Tower> patchUnitStatus(
            @PathVariable String towerId,
            @PathVariable String unitNumber,
            @RequestBody Map<String, Object> updates) {
        Tower updatedTower = inventoryService.patchUnitStatus(towerId, unitNumber, updates);

        // 🔥 Broadcast unit update event
        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("UNIT_UPDATE", updatedTower, "SERVER"));

        return ResponseEntity.ok(updatedTower);
    }

    // DELETE
    @DeleteMapping("/inventory/tower/{id}")
    public ResponseEntity<Map<String, String>> deleteTower(@PathVariable String id) {
        inventoryService.deleteTower(id);

        // 🔥 Broadcast delete event
        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("INVENTORY_DELETE", id, "SERVER"));

        return ResponseEntity.ok(Map.of("message", "Tower with id " + id + " deleted successfully."));
    }
}