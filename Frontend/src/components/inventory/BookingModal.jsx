import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useKiosk } from '../../hooks/useKiosk';
import { kioskApi } from '../../api/kioskApi';

export const BookingModal = () => {
  const { bookingModalOpen, setBookingModalOpen, selectedUnit, fetchInventory, showNotification } = useKiosk();
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const handleNameChange = (e) => {
    const value = e.target.value;

    if (/^[A-Za-z ]*$/.test(value)) {
      setCustomerName(value);
      setNameError("");
    } else {
      setNameError("Only alphabets are allowed");
    }
  };
  const handlePhoneChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value);
      setPhoneError("");
    }

    if (value.length === 10) {
      setPhoneError("");
    } else {
      setPhoneError("Phone number must be 10 digits");
    }
  }

  const handleClose = () => {
    setBookingModalOpen(false);
    setCustomerName('');
    setPhoneNumber('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setNameError("Customer name is required");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(customerName)) {
      setNameError("Only alphabets are allowed");
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      setPhoneError("Enter a valid 10-digit phone number");
      return;
    }
    if (!customerName || !phoneNumber) {
      showNotification('Please fill in all details', 'warning');
      return;
    }

    try {
      setSubmitting(true);

      // API Payload: { towerId, unitNumber, customerName, phoneNumber }
      const payload = {
        towerId: selectedUnit?.towerId,
        unitNumber: selectedUnit?.unitNumber,
        customerName,
        phoneNumber,
      };

      const response = await kioskApi.bookUnit(payload);
      showNotification(response.message || 'Unit booked successfully!', 'success');

      await fetchInventory();
      handleClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to book unit. It might be already taken.';
      showNotification(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }

  };

  return (
    <Dialog open={bookingModalOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight="bold">
        Confirm Booking - Unit {selectedUnit?.unitNumber}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Enter customer details below to instantly reserve this unit.
            </Typography>
            <TextField
              label="Customer Full Name"
              variant="outlined"
              size="small"
              fullWidth
              required
              value={customerName}
              onChange={handleNameChange}
              onBlur={() => {
                if (!customerName.trim()) {
                  setNameError("Customer name is required");
                }
              }}
              error={!!nameError}
              helperText={nameError}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              size="small"
              fullWidth
              required
              value={phoneNumber}
              onChange={handlePhoneChange}
              onBlur={() => {
                if (phoneNumber.length !== 10) {
                  setPhoneError("Phone number must be 10 digits");
                }
              }}
              error={!!phoneError}
              helperText={phoneError}
              inputProps={{
                maxLength: 10
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};