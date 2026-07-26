import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  CircularProgress,
  TextField,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { kioskApi } from '../../api/kioskApi';
import { useKiosk } from '../../hooks/useKiosk';

export const BookingManagementModal = ({ open, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ customerName: '', phoneNumber: '' });
  const { showNotification, fetchInventory } = useKiosk();

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await kioskApi.getBookings();
      setBookings(data || []);
    } catch (err) {
      showNotification('Failed to fetch bookings list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadBookings();
    }
  }, [open]);

  const handleEditClick = (booking) => {
    setEditingId(booking.id);
    setEditData({ customerName: booking.customerName || '', phoneNumber: booking.phoneNumber || '' });
  };

  const handleSaveEdit = async (bookingId) => {
    try {
      await kioskApi.patchBooking(bookingId, editData);
      showNotification('Booking details updated successfully!', 'success');
      setEditingId(null);
      loadBookings();
    } catch (err) {
      showNotification('Failed to update booking', 'error');
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel and delete this booking?')) return;
    try {
      await kioskApi.deleteBooking(bookingId);
      showNotification('Booking deleted successfully!', 'info');
      loadBookings();
      fetchInventory();
    } catch (err) {
      showNotification('Failed to delete booking', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          Booking Management (CRUD)
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : bookings.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
            No bookings recorded yet.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Tower ID</TableCell>
                <TableCell>Unit #</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id || Math.random()}>
                  <TableCell>{b.id}</TableCell>
                  <TableCell>{b.towerId}</TableCell>
                  <TableCell>{b.unitNumber}</TableCell>
                  <TableCell>
                    {editingId === b.id ? (
                      <TextField
                        size="small"
                        value={editData.customerName}
                        onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                      />
                    ) : (
                      b.customerName
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === b.id ? (
                      <TextField
                        size="small"
                        value={editData.phoneNumber}
                        onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                      />
                    ) : (
                      b.phoneNumber
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editingId === b.id ? (
                      <IconButton color="primary" onClick={() => handleSaveEdit(b.id)}>
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton color="primary" onClick={() => handleEditClick(b)}>
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton color="error" onClick={() => handleDelete(b.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};