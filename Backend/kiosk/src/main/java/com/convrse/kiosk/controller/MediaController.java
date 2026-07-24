package com.convrse.kiosk.controller;

import com.convrse.kiosk.exception.ResourceNotFoundException;
import com.convrse.kiosk.model.MediaItem;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MediaController {

    private final List<MediaItem> galleryList = new ArrayList<>(List.of(
            new MediaItem("1", "Luxury Tower Exterior", "IMAGE", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80", "Modern architectural design with premium facade."),
            new MediaItem("2", "Living Room Interior", "IMAGE", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80", "Spacious living area with floor-to-ceiling windows.")
    ));

    private final List<MediaItem> videoList = new ArrayList<>(List.of(
            new MediaItem("v1", "360° Property Walkthrough", "VIDEO", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", "A complete virtual walk-through of the project.")
    ));

    // --- GALLERY ENDPOINTS ---

    @GetMapping("/gallery")
    public ResponseEntity<List<MediaItem>> getGalleryImages() {
        return ResponseEntity.ok(galleryList);
    }

    @GetMapping("/gallery/{id}")
    public ResponseEntity<MediaItem> getGalleryById(@PathVariable String id) {
        return galleryList.stream()
                .filter(item -> item.getId().equalsIgnoreCase(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item not found with id: " + id));
    }

    @PostMapping("/gallery")
    public ResponseEntity<MediaItem> addGalleryImage(@RequestBody MediaItem newItem) {
        galleryList.add(newItem);
        return ResponseEntity.ok(newItem);
    }

    @PutMapping("/gallery/{id}")
    public ResponseEntity<MediaItem> updateGalleryImage(@PathVariable String id, @RequestBody MediaItem updatedItem) {
        MediaItem existing = galleryList.stream()
                .filter(item -> item.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item not found with id: " + id));

        existing.setTitle(updatedItem.getTitle());
        existing.setType(updatedItem.getType());
        existing.setUrl(updatedItem.getUrl());
        existing.setDescription(updatedItem.getDescription());

        return ResponseEntity.ok(existing);
    }

    @PatchMapping("/gallery/{id}")
    public ResponseEntity<MediaItem> patchGalleryImage(@PathVariable String id, @RequestBody Map<String, String> updates) {
        MediaItem existing = galleryList.stream()
                .filter(item -> item.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item not found with id: " + id));

        if (updates.containsKey("title")) existing.setTitle(updates.get("title"));
        if (updates.containsKey("url")) existing.setUrl(updates.get("url"));
        if (updates.containsKey("description")) existing.setDescription(updates.get("description"));

        return ResponseEntity.ok(existing);
    }

    @DeleteMapping("/gallery/{id}")
    public ResponseEntity<Map<String, String>> deleteGalleryImage(@PathVariable String id) {
        boolean removed = galleryList.removeIf(item -> item.getId().equalsIgnoreCase(id));
        if (!removed) {
            throw new ResourceNotFoundException("Gallery item not found with id: " + id);
        }
        return ResponseEntity.ok(Map.of("message", "Gallery item with id " + id + " deleted successfully."));
    }

    // --- VIDEO ENDPOINTS ---

    @GetMapping("/videos")
    public ResponseEntity<List<MediaItem>> getVideos() {
        return ResponseEntity.ok(videoList);
    }

    @GetMapping("/videos/{id}")
    public ResponseEntity<MediaItem> getVideoById(@PathVariable String id) {
        return videoList.stream()
                .filter(item -> item.getId().equalsIgnoreCase(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Video item not found with id: " + id));
    }

    @PostMapping("/videos")
    public ResponseEntity<MediaItem> addVideo(@RequestBody MediaItem newVideo) {
        videoList.add(newVideo);
        return ResponseEntity.ok(newVideo);
    }

    @PutMapping("/videos/{id}")
    public ResponseEntity<MediaItem> updateVideo(@PathVariable String id, @RequestBody MediaItem updatedVideo) {
        MediaItem existing = videoList.stream()
                .filter(item -> item.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Video item not found with id: " + id));

        existing.setTitle(updatedVideo.getTitle());
        existing.setUrl(updatedVideo.getUrl());
        existing.setDescription(updatedVideo.getDescription());

        return ResponseEntity.ok(existing);
    }

    @PatchMapping("/videos/{id}")
    public ResponseEntity<MediaItem> patchVideo(@PathVariable String id, @RequestBody Map<String, String> updates) {
        MediaItem existing = videoList.stream()
                .filter(item -> item.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Video item not found with id: " + id));

        if (updates.containsKey("title")) existing.setTitle(updates.get("title"));
        if (updates.containsKey("url")) existing.setUrl(updates.get("url"));
        if (updates.containsKey("description")) existing.setDescription(updates.get("description"));

        return ResponseEntity.ok(existing);
    }

    @DeleteMapping("/videos/{id}")
    public ResponseEntity<Map<String, String>> deleteVideo(@PathVariable String id) {
        boolean removed = videoList.removeIf(item -> item.getId().equalsIgnoreCase(id));
        if (!removed) {
            throw new ResourceNotFoundException("Video item not found with id: " + id);
        }
        return ResponseEntity.ok(Map.of("message", "Video item with id " + id + " deleted successfully."));
    }
}