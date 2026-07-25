// src/App.jsx
import React from 'react';
import { WebSocketProvider } from './context/WebSocketContext';
import { KioskProvider } from './context/KioskContext';
import { Navbar } from './components/common/Navbar';
import { InventoryPage } from './pages/InventoryPage';
import { GalleryPage } from './pages/GalleryPage';
import { VideosPage } from './pages/VideosPage';
import { ImagePreviewModal } from './components/gallery/ImagePreviewModal';
import { VideoPlayerModal } from './components/videos/VideoPlayerModal';
import { FeedbackSnackbar } from './components/common/FeedbackSnackbar';
import { useKiosk } from './hooks/useKiosk';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SyncedMediaPlayer } from './components/SyncedMediaPlayer';
import { SyncedBookingModal } from './components/SyncedBookingModal';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

const MainContent = () => {
  const { activeTab } = useKiosk();

  return (
    <>
      <Navbar />
      {activeTab === 'inventory' && <InventoryPage />}
      {activeTab === 'gallery' && <GalleryPage />}
      {activeTab === 'videos' && <VideosPage />}

      <ImagePreviewModal />
      <VideoPlayerModal />
      <FeedbackSnackbar />

      {/* <SyncedMediaPlayer /> */}
      {/* <SyncedBookingModal /> */}
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WebSocketProvider>
        <KioskProvider>
          <MainContent />
        </KioskProvider>
      </WebSocketProvider>
    </ThemeProvider>
  );
}