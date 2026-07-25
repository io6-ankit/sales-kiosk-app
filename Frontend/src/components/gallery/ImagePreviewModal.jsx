// src/components/gallery/ImagePreviewModal.jsx
import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useKiosk } from '../../hooks/useKiosk';

export const ImagePreviewModal = () => {
  const { activeImage, setActiveImage } = useKiosk();

  const handleClose = () => {
    setActiveImage(null);
  };

  const imageUrl = activeImage?.url || activeImage?.imageUrl;

  return (
    <Dialog open={Boolean(activeImage)} onClose={handleClose} maxWidth="md" fullWidth>
      {activeImage && (
        <>
          <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">{activeImage.title}</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0, textAlign: 'center', backgroundColor: '#000' }}>
            <Box
              component="img"
              src={imageUrl}
              alt={activeImage.title}
              sx={{
                maxHeight: '70vh',
                maxWidth: '100%',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
              }}
            />
            {activeImage.description && (
              <Box sx={{ p: 2, backgroundColor: '#121212', color: '#fff' }}>
                <Typography variant="body2">{activeImage.description}</Typography>
              </Box>
            )}
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};