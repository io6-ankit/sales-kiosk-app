package com.convrse.kiosk.controller;

import com.convrse.kiosk.exception.ResourceNotFoundException;
import com.convrse.kiosk.model.MediaItem;
import com.convrse.kiosk.model.SyncMessage;
import com.convrse.kiosk.repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MediaController {

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // WebSocket Broadcaster

    // --- GALLERY ENDPOINTS ---

    @GetMapping("/gallery")
    public ResponseEntity<List<MediaItem>> getGalleryImages() {
        return ResponseEntity.ok(mediaRepository.findByType("IMAGE"));
    }

    @GetMapping("/gallery/{id}")
    public ResponseEntity<MediaItem> getGalleryById(@PathVariable String id) {
        return mediaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item not found with id: " + id));
    }

    @PostMapping("/gallery")
    public ResponseEntity<MediaItem> addGalleryImage(@RequestBody MediaItem newItem) {
        newItem.setId(null); // ✅ FIX: Prevents null id issue, forces MongoDB auto-generated ObjectId
        newItem.setType("IMAGE");
        MediaItem savedItem = mediaRepository.save(newItem);

        // Broadcast change to WebSocket SockJS clients
        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("GALLERY_ADD", savedItem, "SERVER"));

        return ResponseEntity.ok(savedItem);
    }

    @PutMapping("/gallery/{id}")
    public ResponseEntity<MediaItem> updateGalleryImage(@PathVariable String id, @RequestBody MediaItem updatedItem) {
        MediaItem existing = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item not found with id: " + id));

        existing.setTitle(updatedItem.getTitle());
        existing.setType("IMAGE");
        existing.setUrl(updatedItem.getUrl());
        existing.setDescription(updatedItem.getDescription());

        MediaItem saved = mediaRepository.save(existing);

        // Broadcast update
        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("GALLERY_UPDATE", saved, "SERVER"));

        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/gallery/{id}")
    public ResponseEntity<MediaItem> patchGalleryImage(@PathVariable String id, @RequestBody Map<String, String> updates) {
        MediaItem existing = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item not found with id: " + id));

        if (updates.containsKey("title")) existing.setTitle(updates.get("title"));
        if (updates.containsKey("url")) existing.setUrl(updates.get("url"));
        if (updates.containsKey("description")) existing.setDescription(updates.get("description"));

        MediaItem saved = mediaRepository.save(existing);

        // Broadcast patch update
        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("GALLERY_UPDATE", saved, "SERVER"));

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/gallery/{id}")
    public ResponseEntity<Map<String, String>> deleteGalleryImage(@PathVariable String id) {
        if (!mediaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Gallery item not found with id: " + id);
        }
        mediaRepository.deleteById(id);

        // Broadcast deletion
        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("GALLERY_DELETE", id, "SERVER"));

        return ResponseEntity.ok(Map.of("message", "Gallery item with id " + id + " deleted successfully."));
    }

    // --- VIDEO ENDPOINTS ---

    @GetMapping("/videos")
    public ResponseEntity<List<MediaItem>> getVideos() {
        return ResponseEntity.ok(mediaRepository.findByType("VIDEO"));
    }

    @GetMapping("/videos/{id}")
    public ResponseEntity<MediaItem> getVideoById(@PathVariable String id) {
        return mediaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Video item not found with id: " + id));
    }

    @PostMapping("/videos")
    public ResponseEntity<MediaItem> addVideo(@RequestBody MediaItem newVideo) {
        newVideo.setId(null); // ✅ FIX: Prevents null id issue for videos as well
        newVideo.setType("VIDEO");
        MediaItem savedVideo = mediaRepository.save(newVideo);

        // Broadcast change
        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("VIDEO_ADD", savedVideo, "SERVER"));

        return ResponseEntity.ok(savedVideo);
    }

    @PutMapping("/videos/{id}")
    public ResponseEntity<MediaItem> updateVideo(@PathVariable String id, @RequestBody MediaItem updatedVideo) {
        MediaItem existing = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video item not found with id: " + id));

        existing.setTitle(updatedVideo.getTitle());
        existing.setType("VIDEO");
        existing.setUrl(updatedVideo.getUrl());
        existing.setDescription(updatedVideo.getDescription());

        MediaItem saved = mediaRepository.save(existing);

        // Broadcast update
        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("VIDEO_UPDATE", saved, "SERVER"));

        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/videos/{id}")
    public ResponseEntity<MediaItem> patchVideo(@PathVariable String id, @RequestBody Map<String, String> updates) {
        MediaItem existing = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video item not found with id: " + id));

        if (updates.containsKey("title")) existing.setTitle(updates.get("title"));
        if (updates.containsKey("url")) existing.setUrl(updates.get("url"));
        if (updates.containsKey("description")) existing.setDescription(updates.get("description"));

        MediaItem saved = mediaRepository.save(existing);

        // Broadcast patch update
        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("VIDEO_UPDATE", saved, "SERVER"));

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/videos/{id}")
    public ResponseEntity<Map<String, String>> deleteVideo(@PathVariable String id) {
        if (!mediaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Video item not found with id: " + id);
        }
        mediaRepository.deleteById(id);

        // Broadcast deletion
        messagingTemplate.convertAndSend("/topic/sync", new SyncMessage("VIDEO_DELETE", id, "SERVER"));

        return ResponseEntity.ok(Map.of("message", "Video item with id " + id + " deleted successfully."));
    }
}