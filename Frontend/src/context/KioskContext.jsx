// // src/context/KioskContext.jsx
// import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
// import { WebSocketContext } from './WebSocketContext';
// import { kioskApi } from '../api/kioskApi';

// export const KioskContext = createContext(null);

// export const KioskProvider = ({ children }) => {
//   const { publishMirrorState, lastMessage } = useContext(WebSocketContext);

//   const [role, setRole] = useState('CONTROLLER'); // 'CONTROLLER' or 'VIEWER'
//   const [activeTab, setActiveTabState] = useState('inventory');
//   const [towers, setTowers] = useState([]);
//   const [selectedTowerId, setSelectedTowerIdState] = useState(null);
//   const [selectedUnit, setSelectedUnitState] = useState(null);
//   const [activeImage, setActiveImageState] = useState(null);
//   const [activeVideo, setActiveVideoState] = useState(null);
//   const [bookingModalOpen, setBookingModalOpenState] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

//   // Use Ref to hold latest state to avoid stale closure issues in syncState
//   const stateRef = useRef({
//     activeTab,
//     selectedTowerId,
//     selectedUnit,
//     activeImage,
//     activeVideo,
//     bookingModalOpen,
//     role,
//   });

//   // Keep stateRef in sync with current state
//   useEffect(() => {
//     stateRef.current = {
//       activeTab,
//       selectedTowerId,
//       selectedUnit,
//       activeImage,
//       activeVideo,
//       bookingModalOpen,
//       role,
//     };
//   }, [activeTab, selectedTowerId, selectedUnit, activeImage, activeVideo, bookingModalOpen, role]);

//   // Initial Data Fetch
//   const fetchInventory = async () => {
//     try {
//       setLoading(true);
//       const data = await kioskApi.getInventory();
//       setTowers(data || []);
//       if (data && data.length > 0 && !selectedTowerId) {
//         setSelectedTowerIdState(data[0].id);
//       }
//     } catch (err) {
//       showNotification('Failed to load inventory data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInventory();
//   }, []);

//   const showNotification = (message, severity = 'info') => {
//     setNotification({ open: true, message, severity });
//   };

//   const closeNotification = () => {
//     setNotification((prev) => ({ ...prev, open: false }));
//   };

//   // 🔴 FIX 1: Robust Sync State Emitter (Prevents Stale Closure)
//   const syncState = useCallback((updatedFields) => {
//     if (stateRef.current.role !== 'CONTROLLER') return;

//     const current = stateRef.current;
//     const fullState = {
//       type: 'SYNC_MIRROR',
//       activeTab: updatedFields.activeTab !== undefined ? updatedFields.activeTab : current.activeTab,
//       selectedTowerId: updatedFields.selectedTowerId !== undefined ? updatedFields.selectedTowerId : current.selectedTowerId,
//       selectedUnit: updatedFields.selectedUnit !== undefined ? updatedFields.selectedUnit : current.selectedUnit,
//       activeImage: updatedFields.activeImage !== undefined ? updatedFields.activeImage : current.activeImage,
//       activeVideo: updatedFields.activeVideo !== undefined ? updatedFields.activeVideo : current.activeVideo,
//       bookingModalOpen: updatedFields.bookingModalOpen !== undefined ? updatedFields.bookingModalOpen : current.bookingModalOpen,
//     };

//     if (publishMirrorState) {
//       publishMirrorState(fullState);
//     }
//   }, [publishMirrorState]);

//   // 🔴 FIX 2: WebSocket Incoming Payload Parser
//   useEffect(() => {
//     if (!lastMessage) return;

//     // Direct flat payload check OR nested mirrorState check (supporting both)
//     const payload = lastMessage.mirrorState || lastMessage;

//     // Check for mirror state types OR general sync events
//     if ((lastMessage.type === 'SYNC_MIRROR' || payload.selectedTowerId || payload.activeTab) && role === 'VIEWER') {
//       if (payload.activeTab !== undefined) setActiveTabState(payload.activeTab);
//       if (payload.selectedTowerId !== undefined) setSelectedTowerIdState(payload.selectedTowerId);
//       if (payload.selectedUnit !== undefined) setSelectedUnitState(payload.selectedUnit);
//       if (payload.activeImage !== undefined) setActiveImageState(payload.activeImage);
//       if (payload.activeVideo !== undefined) setActiveVideoState(payload.activeVideo);
//       if (payload.bookingModalOpen !== undefined) setBookingModalOpenState(payload.bookingModalOpen);
//     }

//     if (lastMessage.type === 'INVENTORY_UPDATE' || lastMessage.type === 'UNIT_UPDATED' || lastMessage.type === 'TOWER_ADDED') {
//       fetchInventory();
//     }
//   }, [lastMessage, role]);

//   // Wrapped Setters
//   const setActiveTab = (tab) => {
//     setActiveTabState(tab);
//     syncState({ activeTab: tab });
//   };

//   const setSelectedTowerId = (towerId) => {
//     setSelectedTowerIdState(towerId);
//     syncState({ selectedTowerId: towerId });
//   };

//   const setSelectedUnit = (unit) => {
//     setSelectedUnitState(unit);
//     syncState({ selectedUnit: unit });
//   };

//   const setActiveImage = (image) => {
//     setActiveImageState(image);
//     syncState({ activeImage: image });
//   };

//   const setActiveVideo = (video) => {
//     setActiveVideoState(video);
//     syncState({ activeVideo: video });
//   };

//   const setBookingModalOpen = (isOpen) => {
//     setBookingModalOpenState(isOpen);
//     syncState({ bookingModalOpen: isOpen });
//   };

//   return (
//     <KioskContext.Provider
//       value={{
//         role,
//         setRole,
//         activeTab,
//         setActiveTab,
//         towers,
//         selectedTowerId,
//         setSelectedTowerId,
//         selectedUnit,
//         setSelectedUnit,
//         activeImage,
//         setActiveImage,
//         activeVideo,
//         setActiveVideo,
//         bookingModalOpen,
//         setBookingModalOpen,
//         loading,
//         fetchInventory,
//         notification,
//         showNotification,
//         closeNotification,
//       }}
//     >
//       {children}
//     </KioskContext.Provider>
//   );
// };

// src/context/KioskContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback, useRef, useMemo } from 'react';
import { WebSocketContext } from './WebSocketContext';
import { kioskApi } from '../api/kioskApi';

export const KioskContext = createContext(null);

export const KioskProvider = ({ children }) => {
  const { publishMirrorState, lastMessage } = useContext(WebSocketContext);

  const [role, setRole] = useState('CONTROLLER'); // 'CONTROLLER' or 'VIEWER'
  const [activeTab, setActiveTabState] = useState('inventory');
  const [towers, setTowers] = useState([]);
  const [selectedTowerId, setSelectedTowerIdState] = useState(null);
  const [selectedUnit, setSelectedUnitState] = useState(null);

  // Media Sync States
  const [activeImage, setActiveImageState] = useState(null);
  const [activeVideo, setActiveVideoState] = useState(null);
  const [isVideoPlaying, setIsVideoPlayingState] = useState(false);
  const [videoCurrentTime, setVideoCurrentTimeState] = useState(0);

  // Modal / Dialog Sync States
  const [bookingModalOpen, setBookingModalOpenState] = useState(false);
  const [unitDetailsModalOpen, setUnitDetailsModalOpenState] = useState(false);

  // UI Utilities
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Ref to hold latest state to avoid stale closures in syncState
  const stateRef = useRef({
    activeTab,
    selectedTowerId,
    selectedUnit,
    activeImage,
    activeVideo,
    isVideoPlaying,
    videoCurrentTime,
    bookingModalOpen,
    unitDetailsModalOpen,
    role,
  });

  // Keep stateRef in sync with current state
  useEffect(() => {
    stateRef.current = {
      activeTab,
      selectedTowerId,
      selectedUnit,
      activeImage,
      activeVideo,
      isVideoPlaying,
      videoCurrentTime,
      bookingModalOpen,
      unitDetailsModalOpen,
      role,
    };
  }, [
    activeTab,
    selectedTowerId,
    selectedUnit,
    activeImage,
    activeVideo,
    isVideoPlaying,
    videoCurrentTime,
    bookingModalOpen,
    unitDetailsModalOpen,
    role,
  ]);

  const showNotification = useCallback((message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  // Initial Data Fetch
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await kioskApi.getInventory();
      setTowers(data || []);
      if (data && data.length > 0 && !selectedTowerId) {
        setSelectedTowerIdState(data[0].id);
      }
    } catch (err) {
      showNotification('Failed to load inventory data', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedTowerId, showNotification]);

  useEffect(() => {
    fetchInventory();
  }, []);

  // Robust Sync State Emitter (Prevents Stale Closure)
  const syncState = useCallback((updatedFields) => {
    if (stateRef.current.role !== 'CONTROLLER') return;

    const current = stateRef.current;
    const fullState = {
      type: 'SYNC_MIRROR',
      activeTab: updatedFields.activeTab !== undefined ? updatedFields.activeTab : current.activeTab,
      selectedTowerId: updatedFields.selectedTowerId !== undefined ? updatedFields.selectedTowerId : current.selectedTowerId,
      selectedUnit: updatedFields.selectedUnit !== undefined ? updatedFields.selectedUnit : current.selectedUnit,
      activeImage: updatedFields.activeImage !== undefined ? updatedFields.activeImage : current.activeImage,
      activeVideo: updatedFields.activeVideo !== undefined ? updatedFields.activeVideo : current.activeVideo,
      isVideoPlaying: updatedFields.isVideoPlaying !== undefined ? updatedFields.isVideoPlaying : current.isVideoPlaying,
      videoCurrentTime: updatedFields.videoCurrentTime !== undefined ? updatedFields.videoCurrentTime : current.videoCurrentTime,
      bookingModalOpen: updatedFields.bookingModalOpen !== undefined ? updatedFields.bookingModalOpen : current.bookingModalOpen,
      unitDetailsModalOpen: updatedFields.unitDetailsModalOpen !== undefined ? updatedFields.unitDetailsModalOpen : current.unitDetailsModalOpen,
    };

    if (publishMirrorState) {
      publishMirrorState(fullState);
    }
  }, [publishMirrorState]);

  // WebSocket Incoming Payload Parser (VIEWER Mode Listener)
  useEffect(() => {
    if (!lastMessage) return;

    const payload = lastMessage.mirrorState || lastMessage;

    if ((lastMessage.type === 'SYNC_MIRROR' || payload.type === 'SYNC_MIRROR' || payload.selectedTowerId || payload.activeTab !== undefined) && role === 'VIEWER') {
      if (payload.activeTab !== undefined) setActiveTabState(payload.activeTab);
      if (payload.selectedTowerId !== undefined) setSelectedTowerIdState(payload.selectedTowerId);
      if (payload.selectedUnit !== undefined) setSelectedUnitState(payload.selectedUnit);
      if (payload.activeImage !== undefined) setActiveImageState(payload.activeImage);
      if (payload.activeVideo !== undefined) setActiveVideoState(payload.activeVideo);
      if (payload.isVideoPlaying !== undefined) setIsVideoPlayingState(payload.isVideoPlaying);
      if (payload.videoCurrentTime !== undefined) setVideoCurrentTimeState(payload.videoCurrentTime);
      if (payload.bookingModalOpen !== undefined) setBookingModalOpenState(payload.bookingModalOpen);
      if (payload.unitDetailsModalOpen !== undefined) setUnitDetailsModalOpenState(payload.unitDetailsModalOpen);
    }

    if (lastMessage.type === 'INVENTORY_UPDATE' || lastMessage.type === 'UNIT_UPDATED' || lastMessage.type === 'TOWER_ADDED') {
      fetchInventory();
    }
  }, [lastMessage, role, fetchInventory]);

  // Standardized Wrapped Setters (Handles both Local State + Controller Sync)
  const setActiveTab = useCallback((tab) => {
    setActiveTabState(tab);
    syncState({ activeTab: tab });
  }, [syncState]);

  const setSelectedTowerId = useCallback((towerId) => {
    setSelectedTowerIdState(towerId);
    syncState({ selectedTowerId: towerId });
  }, [syncState]);

  const setSelectedUnit = useCallback((unit) => {
    setSelectedUnitState(unit);
    syncState({ selectedUnit: unit });
  }, [syncState]);

  const setActiveImage = useCallback((image) => {
    setActiveImageState(image);
    syncState({ activeImage: image });
  }, [syncState]);

  const setActiveVideo = useCallback((video) => {
    setActiveVideoState(video);
    setIsVideoPlayingState(false);
    setVideoCurrentTimeState(0);
    syncState({ activeVideo: video, isVideoPlaying: false, videoCurrentTime: 0 });
  }, [syncState]);

  const setIsVideoPlaying = useCallback((isPlaying) => {
    setIsVideoPlayingState(isPlaying);
    syncState({ isVideoPlaying: isPlaying });
  }, [syncState]);

  const setVideoCurrentTime = useCallback((time) => {
    setVideoCurrentTimeState(time);
    syncState({ videoCurrentTime: time });
  }, [syncState]);

  const setBookingModalOpen = useCallback((isOpen) => {
    setBookingModalOpenState(isOpen);
    syncState({ bookingModalOpen: isOpen });
  }, [syncState]);

  const setUnitDetailsModalOpen = useCallback((isOpen) => {
    setUnitDetailsModalOpenState(isOpen);
    syncState({ unitDetailsModalOpen: isOpen });
  }, [syncState]);

  const contextValue = useMemo(() => ({
    role,
    setRole,
    activeTab,
    setActiveTab,
    towers,
    selectedTowerId,
    setSelectedTowerId,
    selectedUnit,
    setSelectedUnit,
    activeImage,
    setActiveImage,
    activeVideo,
    setActiveVideo,
    isVideoPlaying,
    setIsVideoPlaying,
    videoCurrentTime,
    setVideoCurrentTime,
    bookingModalOpen,
    setBookingModalOpen,
    unitDetailsModalOpen,
    setUnitDetailsModalOpen,
    loading,
    fetchInventory,
    notification,
    showNotification,
    closeNotification,
  }), [
    role,
    activeTab,
    setActiveTab,
    towers,
    selectedTowerId,
    setSelectedTowerId,
    selectedUnit,
    setSelectedUnit,
    activeImage,
    setActiveImage,
    activeVideo,
    setActiveVideo,
    isVideoPlaying,
    setIsVideoPlaying,
    videoCurrentTime,
    setVideoCurrentTime,
    bookingModalOpen,
    setBookingModalOpen,
    unitDetailsModalOpen,
    setUnitDetailsModalOpen,
    loading,
    fetchInventory,
    notification,
    showNotification,
    closeNotification,
  ]);

  return (
    <KioskContext.Provider value={contextValue}>
      {children}
    </KioskContext.Provider>
  );
};