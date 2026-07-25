// src/components/SyncedMediaPlayer.jsx
import React, { useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useKiosk } from '../hooks/useKiosk';

export const SyncedMediaPlayer = () => {
  const {
    role,
    activeImage,
    setActiveImage,
    activeVideo,
    setActiveVideo,
    isVideoPlaying,
    setIsVideoPlaying,
    videoCurrentTime,
    setVideoCurrentTime,
  } = useKiosk();

  const videoRef = useRef(null);

  // Synchronize Video Play / Pause / Seek Time on Viewer
  useEffect(() => {
    if (!videoRef.current || !activeVideo) return;

    const videoEl = videoRef.current;

    // Direct Seek Time Synchronization (Viewer Side)
    if (role === 'VIEWER' && Math.abs(videoEl.currentTime - videoCurrentTime) > 0.8) {
      videoEl.currentTime = videoCurrentTime;
    }

    // Play/Pause Control Synchronization
    if (isVideoPlaying && videoEl.paused) {
      videoEl.play().catch(() => {});
    } else if (!isVideoPlaying && !videoEl.paused) {
      videoEl.pause();
    }
  }, [isVideoPlaying, videoCurrentTime, activeVideo, role]);

  // Controller Action Handlers
  const handlePlay = () => {
    if (role === 'CONTROLLER') {
      setIsVideoPlaying(true);
    }
  };

  const handlePause = () => {
    if (role === 'CONTROLLER') {
      setIsVideoPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (role === 'CONTROLLER' && videoRef.current) {
      setVideoCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleCloseImage = () => {
    setActiveImage(null);
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
  };

  return (
    <>
      {/* 🖼️ Synchronized Image Lightbox Modal */}
      <Dialog
        open={Boolean(activeImage)}
        onClose={handleCloseImage}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ position: 'relative', bgcolor: '#000', minHeight: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {role === 'CONTROLLER' && (
            <IconButton
              onClick={handleCloseImage}
              sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 10 }}
            >
              <CloseIcon />
            </IconButton>
          )}
          {activeImage && (
            <img
              src={activeImage.url || activeImage.imageUrl}
              alt={activeImage.title || 'Showcase'}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          )}
        </Box>
        {activeImage && activeImage.title && (
          <DialogContent>
            <Typography variant="h6" fontWeight="bold">
              {activeImage.title}
            </Typography>
            {activeImage.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {activeImage.description}
              </Typography>
            )}
          </DialogContent>
        )}
      </Dialog>

      {/* 🎬 Synchronized Video Player Modal */}
      <Dialog
        open={Boolean(activeVideo)}
        onClose={handleCloseVideo}
        maxWidth="md"
        fullWidth
      >
        {activeVideo && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {activeVideo.title || 'Video Presentation'}
              </Typography>
              {role === 'CONTROLLER' && (
                <IconButton onClick={handleCloseVideo}>
                  <CloseIcon />
                </IconButton>
              )}
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0, bgcolor: '#000', display: 'flex', justifyContent: 'center' }}>
              <video
                ref={videoRef}
                src={activeVideo.url || activeVideo.videoUrl}
                controls={role === 'CONTROLLER'} // Controls hidden for Viewer to maintain exact sync
                style={{ width: '100%', maxHeight: '75vh' }}
                onPlay={handlePlay}
                onPause={handlePause}
                onTimeUpdate={handleTimeUpdate}
              />
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};