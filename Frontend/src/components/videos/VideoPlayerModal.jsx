import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useKiosk } from '../../hooks/useKiosk';

export const VideoPlayerModal = () => {
  const { activeVideo, setActiveVideo } = useKiosk();

  const handleClose = () => {
    setActiveVideo(null);
  };

  const videoUrl = activeVideo?.url || activeVideo?.videoUrl;

  return (
    <Dialog open={Boolean(activeVideo)} onClose={handleClose} maxWidth="md" fullWidth>
      {activeVideo && (
        <>
          <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">{activeVideo.title}</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0, backgroundColor: '#000' }}>
            <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
              <video
                controls
                autoPlay
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
                src={videoUrl}
              />
            </Box>
            {activeVideo.description && (
              <Box sx={{ p: 2, backgroundColor: '#121212', color: '#fff' }}>
                <Typography variant="body2">{activeVideo.description}</Typography>
              </Box>
            )}
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};