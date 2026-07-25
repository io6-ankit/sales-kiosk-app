// src/components/common/Navbar.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Chip, Switch, FormControlLabel } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CollectionsIcon from '@mui/icons-material/Collections';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SignalWifi4BarIcon from '@mui/icons-material/SignalWifi4Bar';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import { useKiosk } from '../../hooks/useKiosk';
import { WebSocketContext } from '../../context/WebSocketContext';
import { BookingManagementModal } from '../admin/BookingManagementModal';

export const Navbar = () => {
  const { activeTab, setActiveTab, role, setRole } = useKiosk();
  // ✅ FIX 1: Extract lastMessage along with isConnected and publishMirrorState
  const { isConnected, publishMirrorState, lastMessage } = useContext(WebSocketContext);
  const [bookingManageOpen, setBookingManageOpen] = useState(false);

  // ✅ FIX 2: Handle Tab Switch locally AND broadcast to WebSocket
  const handleTabChange = (newTab) => {
    setActiveTab(newTab); // Update local tab state

    // Only send mirror command if user is CONTROLLER (Viewer tab sync commands ignore/optional logic)
    if (publishMirrorState) {
      publishMirrorState({
        type: 'TAB_CHANGE',
        activeTab: newTab,
        payload: { targetId: `${newTab}-tab` }
      });
    }
  };

  // ✅ FIX 3: Listen for incoming WebSocket Tab Change events from other screens
  useEffect(() => {
    if (lastMessage) {
      // Check if message is a Tab Change/Mirror event from another screen
      const incomingTab = lastMessage.activeTab || (lastMessage.payload && lastMessage.payload.targetId);
      
      if (incomingTab) {
        // Remove '-tab' suffix if sent in targetId format (e.g., 'gallery-tab' -> 'gallery')
        const cleanTabName = incomingTab.replace('-tab', '');
        
        if (cleanTabName !== activeTab) {
          console.log('🔄 Mirror Tab Change Received:', cleanTabName);
          setActiveTab(cleanTabName); // Auto-switch tab on this screen
        }
      }
    }
  }, [lastMessage, activeTab, setActiveTab]);

  const handleRoleToggle = (e) => {
    setRole(e.target.checked ? 'VIEWER' : 'CONTROLLER');
  };

  return (
    <>
      <AppBar position="sticky" color="default" elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              REAL-ESTATE KIOSK
            </Typography>
            <Chip
              icon={isConnected ? <SignalWifi4BarIcon /> : <SignalWifiOffIcon />}
              label={isConnected ? 'Live Sync Active' : 'Disconnected'}
              color={isConnected ? 'success' : 'error'}
              size="small"
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, my: { xs: 1, sm: 0 }, flexWrap: 'wrap' }}>
            <Button
              variant={activeTab === 'inventory' ? 'contained' : 'text'}
              startIcon={<DashboardIcon />}
              onClick={() => handleTabChange('inventory')}
            >
              Inventory
            </Button>
            <Button
              variant={activeTab === 'gallery' ? 'contained' : 'text'}
              startIcon={<CollectionsIcon />}
              onClick={() => handleTabChange('gallery')}
            >
              Gallery
            </Button>
            <Button
              variant={activeTab === 'videos' ? 'contained' : 'text'}
              startIcon={<VideoLibraryIcon />}
              onClick={() => handleTabChange('videos')}
            >
              Videos
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<AssignmentIcon />}
              onClick={() => setBookingManageOpen(true)}
            >
              Bookings Admin
            </Button>
          </Box>

          <FormControlLabel
            control={<Switch checked={role === 'VIEWER'} onChange={handleRoleToggle} color="secondary" />}
            label={
              <Typography variant="body2" fontWeight="bold">
                Mode: {role}
              </Typography>
            }
          />
        </Toolbar>
      </AppBar>

      {/* Admin Booking CRUD Dialog */}
      <BookingManagementModal open={bookingManageOpen} onClose={() => setBookingManageOpen(false)} />
    </>
  );
};