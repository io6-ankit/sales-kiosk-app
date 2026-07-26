import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useKiosk } from '../../hooks/useKiosk';

export const FeedbackSnackbar = () => {
  const { notification, closeNotification } = useKiosk();

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={4000}
      onClose={closeNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={closeNotification} severity={notification.severity || 'info'} variant="filled" sx={{ width: '100%' }}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
};