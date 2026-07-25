// src/components/SyncedBookingModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useKiosk } from '../hooks/useKiosk';

export const SyncedBookingModal = () => {
  const {
    role,
    selectedUnit,
    bookingModalOpen,
    setBookingModalOpen,
    unitDetailsModalOpen,
    setUnitDetailsModalOpen,
    showNotification,
  } = useKiosk();

  const handleCloseBooking = () => {
    if (role === 'CONTROLLER') {
      setBookingModalOpen(false);
    }
  };

  const handleCloseUnitDetails = () => {
    if (role === 'CONTROLLER') {
      setUnitDetailsModalOpen(false);
    }
  };

  const handleConfirmBooking = () => {
    if (role === 'CONTROLLER') {
      showNotification(`Booking initiated for Unit ${selectedUnit?.unitNumber || ''}`, 'success');
      setBookingModalOpen(false);
    }
  };

  return (
    <>
      {/* 🏢 Synchronized Unit Details Modal */}
      <Dialog
        open={Boolean(unitDetailsModalOpen && selectedUnit)}
        onClose={handleCloseUnitDetails}
        maxWidth="sm"
        fullWidth
      >
        {selectedUnit && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Unit Details - {selectedUnit.unitNumber || selectedUnit.name}
              </Typography>
              {role === 'CONTROLLER' && (
                <IconButton onClick={handleCloseUnitDetails}>
                  <CloseIcon />
                </IconButton>
              )}
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Floor:</Typography>
                  <Typography fontWeight="medium">{selectedUnit.floor || 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Area / Size:</Typography>
                  <Typography fontWeight="medium">{selectedUnit.size || selectedUnit.area || 'N/A'} sq.ft</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Price:</Typography>
                  <Typography fontWeight="bold" color="primary.main">
                    ₹{selectedUnit.price ? selectedUnit.price.toLocaleString() : 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography color="text.secondary">Status:</Typography>
                  <Chip
                    label={selectedUnit.status || 'AVAILABLE'}
                    color={
                      selectedUnit.status === 'BOOKED'
                        ? 'error'
                        : selectedUnit.status === 'BLOCKED'
                        ? 'warning'
                        : 'success'
                    }
                    size="small"
                  />
                </Box>
              </Box>
            </DialogContent>
            {role === 'CONTROLLER' && (
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleCloseUnitDetails} color="inherit">
                  Close
                </Button>
                {selectedUnit.status !== 'BOOKED' && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setUnitDetailsModalOpen(false);
                      setBookingModalOpen(true);
                    }}
                  >
                    Proceed to Book
                  </Button>
                )}
              </DialogActions>
            )}
          </>
        )}
      </Dialog>

      {/* 📝 Synchronized Booking Form Modal */}
      <Dialog
        open={Boolean(bookingModalOpen && selectedUnit)}
        onClose={handleCloseBooking}
        maxWidth="sm"
        fullWidth
      >
        {selectedUnit && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Book Unit #{selectedUnit.unitNumber || selectedUnit.name}
              </Typography>
              {role === 'CONTROLLER' && (
                <IconButton onClick={handleCloseBooking}>
                  <CloseIcon />
                </IconButton>
              )}
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1, mb: 2 }}>
                <Typography variant="subtitle2" color="primary">
                  Selected Unit Summary
                </Typography>
                <Typography variant="body2">
                  Unit: <strong>{selectedUnit.unitNumber || selectedUnit.name}</strong> | Price: <strong>₹{selectedUnit.price?.toLocaleString() || 'N/A'}</strong>
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                {role === 'CONTROLLER'
                  ? 'Click "Confirm Reserve" below to proceed with the unit reservation.'
                  : 'Executive is currently presenting the booking agreement details...'}
              </Typography>
            </DialogContent>
            {role === 'CONTROLLER' && (
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleCloseBooking} color="inherit">
                  Cancel
                </Button>
                <Button variant="contained" color="success" onClick={handleConfirmBooking}>
                  Confirm Reserve
                </Button>
              </DialogActions>
            )}
          </>
        )}
      </Dialog>
    </>
  );
};