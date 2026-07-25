// src/components/inventory/UnitCard.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useKiosk } from '../../hooks/useKiosk';
import { kioskApi } from '../../api/kioskApi';

export const UnitCard = ({ unit, towerId, floorNum }) => {
  const { setSelectedUnit, setBookingModalOpen, role, showNotification, fetchInventory } = useKiosk();
  const [editOpen, setEditOpen] = useState(false);
  const [unitPrice, setUnitPrice] = useState(unit.price || 0);
  const [isBookedState, setIsBookedState] = useState(unit.booked || unit.status === 'BOOKED');

  const isBooked = unit.booked || unit.status === 'BOOKED';

  const handleBookClick = () => {
    setSelectedUnit({ ...unit, towerId });
    setBookingModalOpen(true);
  };

  const handlePatchUnit = async (e) => {
    e.preventDefault();
    try {
      await kioskApi.patchUnitInTower(towerId, unit.unitNumber, {
        price: Number(unitPrice),
        booked: isBookedState,
        status: isBookedState ? 'BOOKED' : 'AVAILABLE',
      });
      showNotification(`Flat #${unit.unitNumber} updated successfully!`, 'success');
      setEditOpen(false);
      fetchInventory();
    } catch (err) {
      showNotification('Failed to update flat details', 'error');
    }
  };

  return (
    <>
      <Card
        elevation={2}
        sx={{
          // FIXED HEIGHT & WIDTH FOR ALL CARDS
          width: 270,
          height: 230,
          borderRadius: 3,
          border: '1px solid',
          borderColor: isBooked ? 'error.light' : 'success.light',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        }}
      >
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Card Top Header */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    p: 0.8,
                    borderRadius: 2,
                    bgcolor: isBooked ? 'error.50' : 'success.50',
                    color: isBooked ? 'error.main' : 'success.main',
                    display: 'flex',
                  }}
                >
                  <MeetingRoomIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="800" sx={{ lineHeight: 1.1 }}>
                    Flat #{unit.unitNumber}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Floor - {floorNum || unit.floor || 1}
                  </Typography>
                </Box>
              </Box>

              {role === 'CONTROLLER' && (
                <IconButton size="small" onClick={() => setEditOpen(true)}>
                  <EditTwoToneIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Price & Status Badge */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Price
                </Typography>
                <Typography variant="subtitle2" fontWeight="800" color="primary.main">
                  ${unit.price ? Number(unit.price).toLocaleString() : 'N/A'}
                </Typography>
              </Box>

              <Chip
                icon={isBooked ? <CancelIcon sx={{ fontSize: '13px !important' }} /> : <CheckCircleIcon sx={{ fontSize: '13px !important' }} />}
                label={isBooked ? 'BOOKED' : 'VACANT'}
                color={isBooked ? 'error' : 'success'}
                size="small"
                sx={{ fontWeight: 800, borderRadius: '6px', fontSize: '0.65rem' }}
              />
            </Box>

            {/* Booked Info */}
            {isBooked && (
              <Typography variant="caption" color="text.secondary" noWrap display="block" sx={{ fontSize: '0.7rem' }}>
                Booked By: <strong>{unit.bookedBy || 'Reserved'}</strong>
              </Typography>
            )}
          </Box>

          {/* Bottom Action Button */}
          <Button
            variant={isBooked ? 'outlined' : 'contained'}
            color={isBooked ? 'error' : 'primary'}
            fullWidth
            size="small"
            disabled={isBooked || role === 'VIEWER'}
            onClick={handleBookClick}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 700,
              py: 0.8,
            }}
          >
            {isBooked ? 'Already Reserved' : 'Book Flat'}
          </Button>
        </CardContent>
      </Card>

      {/* Flat Patch Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight="bold">Update Flat #{unit.unitNumber}</DialogTitle>
        <form onSubmit={handlePatchUnit}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Flat Price ($)"
              type="number"
              size="small"
              fullWidth
              required
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isBookedState}
                  onChange={(e) => setIsBookedState(e.target.checked)}
                  color="error"
                />
              }
              label={
                <Typography variant="body2" fontWeight="600">
                  Mark Status as Booked
                </Typography>
              }
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained">Save Changes</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};