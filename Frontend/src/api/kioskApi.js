// src/api/kioskApi.js
import { axiosClient } from './axiosClient';
import { initialMockGallery, initialMockVideos, initialMockTowers } from './mockData';

// Toggle to false when connecting to Ankit's Live Render Backend
export const USE_MOCK = false;

const getStoredData = (key, fallback) => {
    const data = localStorage.getItem(key);
    if (!data) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
    }
    return JSON.parse(data);
};

const setStoredData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const kioskApi = {
    // --- Gallery APIs ---
    getGallery: async () => {
        if (USE_MOCK) return getStoredData('kiosk_mock_gallery', initialMockGallery);
        const res = await axiosClient.get('/gallery');
        return res.data;
    },

    getGalleryById: async (id) => {
        if (USE_MOCK) {
            const items = getStoredData('kiosk_mock_gallery', initialMockGallery);
            return items.find((item) => item.id === id);
        }
        const res = await axiosClient.get(`/gallery/${id}`);
        return res.data;
    },

    addGalleryItem: async (galleryData) => {
        if (USE_MOCK) {
            const items = getStoredData('kiosk_mock_gallery', initialMockGallery);
            const newItem = { ...galleryData, id: galleryData.id || String(Date.now()) };
            items.push(newItem);
            setStoredData('kiosk_mock_gallery', items);
            return newItem;
        }
        const res = await axiosClient.post('/gallery', galleryData);
        return res.data;
    },

    updateGalleryItem: async (id, galleryData) => {
        if (USE_MOCK) {
            const items = getStoredData('kiosk_mock_gallery', initialMockGallery);
            const updated = items.map((item) => (item.id === id ? { ...item, ...galleryData } : item));
            setStoredData('kiosk_mock_gallery', updated);
            return galleryData;
        }
        const res = await axiosClient.put(`/gallery/${id}`, galleryData);
        return res.data;
    },

    patchGalleryItem: async (id, partialData) => {
        if (USE_MOCK) {
            const items = getStoredData('kiosk_mock_gallery', initialMockGallery);
            const updated = items.map((item) => (item.id === id ? { ...item, ...partialData } : item));
            setStoredData('kiosk_mock_gallery', updated);
            return updated.find((item) => item.id === id);
        }
        const res = await axiosClient.patch(`/gallery/${id}`, partialData);
        return res.data;
    },

    deleteGalleryItem: async (id) => {
        if (USE_MOCK) {
            const items = getStoredData('kiosk_mock_gallery', initialMockGallery);
            const filtered = items.filter((item) => item.id !== id);
            setStoredData('kiosk_mock_gallery', filtered);
            return { success: true };
        }
        const res = await axiosClient.delete(`/gallery/${id}`);
        return res.data;
    },

    // --- Video APIs ---
    getVideos: async () => {
        if (USE_MOCK) return getStoredData('kiosk_mock_videos', initialMockVideos);
        const res = await axiosClient.get('/videos');
        return res.data;
    },

    getVideoById: async (id) => {
        if (USE_MOCK) {
            const items = getStoredData('kiosk_mock_videos', initialMockVideos);
            return items.find((item) => item.id === id);
        }
        const res = await axiosClient.get(`/videos/${id}`);
        return res.data;
    },

    addVideo: async (videoData) => {
        if (USE_MOCK) {
            const items = getStoredData('kiosk_mock_videos', initialMockVideos);
            const newItem = { ...videoData, id: videoData.id || String(Date.now()) };
            items.push(newItem);
            setStoredData('kiosk_mock_videos', items);
            return newItem;
        }
        const res = await axiosClient.post('/videos', videoData);
        return res.data;
    },

    updateVideo: async (id, videoData) => {
        if (USE_MOCK) {
            const items = getStoredData('kiosk_mock_videos', initialMockVideos);
            const updated = items.map((item) => (item.id === id ? { ...item, ...videoData } : item));
            setStoredData('kiosk_mock_videos', updated);
            return videoData;
        }
        const res = await axiosClient.put(`/videos/${id}`, videoData);
        return res.data;
    },

    patchVideo: async (id, partialData) => {
        if (USE_MOCK) {
            const items = getStoredData('kiosk_mock_videos', initialMockVideos);
            const updated = items.map((item) => (item.id === id ? { ...item, ...partialData } : item));
            setStoredData('kiosk_mock_videos', updated);
            return updated.find((item) => item.id === id);
        }
        const res = await axiosClient.patch(`/videos/${id}`, partialData);
        return res.data;
    },

    deleteVideo: async (id) => {
        if (USE_MOCK) {
            const items = getStoredData('kiosk_mock_videos', initialMockVideos);
            const filtered = items.filter((item) => item.id !== id);
            setStoredData('kiosk_mock_videos', filtered);
            return { success: true };
        }
        const res = await axiosClient.delete(`/videos/${id}`);
        return res.data;
    },

    // --- Inventory & Tower APIs ---
    getInventory: async () => {
        if (USE_MOCK) return getStoredData('kiosk_mock_inventory', initialMockTowers);
        const res = await axiosClient.get('/inventory');
        return res.data;
    },

    addTower: async (towerData) => {
        if (USE_MOCK) {
            const towers = getStoredData('kiosk_mock_inventory', initialMockTowers);
            const newTower = { ...towerData, id: 'tower-' + Date.now() };
            towers.push(newTower);
            setStoredData('kiosk_mock_inventory', towers);
            return newTower;
        }
        const res = await axiosClient.post('/inventory/tower', towerData);
        return res.data;
    },

    updateTower: async (towerId, towerData) => {
        if (USE_MOCK) {
            const towers = getStoredData('kiosk_mock_inventory', initialMockTowers);
            const updated = towers.map((t) => (t.id === towerId ? { ...t, ...towerData } : t));
            setStoredData('kiosk_mock_inventory', updated);
            return towerData;
        }
        const res = await axiosClient.put(`/inventory/tower/${towerId}`, towerData);
        return res.data;
    },

    patchTower: async (towerId, partialData) => {
        if (USE_MOCK) {
            const towers = getStoredData('kiosk_mock_inventory', initialMockTowers);
            const updated = towers.map((t) => (t.id === towerId ? { ...t, ...partialData } : t));
            setStoredData('kiosk_mock_inventory', updated);
            return updated.find((t) => t.id === towerId);
        }
        const res = await axiosClient.patch(`/inventory/tower/${towerId}`, partialData);
        return res.data;
    },

    patchUnitInTower: async (towerId, unitNumber, unitData) => {
        if (USE_MOCK) {
            const towers = getStoredData('kiosk_mock_inventory', initialMockTowers);
            const updated = towers.map((tower) => {
                if (tower.id === towerId) {
                    return {
                        ...tower,
                        units: tower.units.map((unit) =>
                            unit.unitNumber === unitNumber ? { ...unit, ...unitData } : unit
                        ),
                    };
                }
                return tower;
            });
            setStoredData('kiosk_mock_inventory', updated);
            return { success: true };
        }
        const res = await axiosClient.patch(`/inventory/tower/${towerId}/unit/${unitNumber}`, unitData);
        return res.data;
    },

    deleteTower: async (towerId) => {
        if (USE_MOCK) {
            const towers = getStoredData('kiosk_mock_inventory', initialMockTowers);
            const filtered = towers.filter((t) => t.id !== towerId);
            setStoredData('kiosk_mock_inventory', filtered);
            return { success: true };
        }
        const res = await axiosClient.delete(`/inventory/tower/${towerId}`);
        return res.data;
    },

    // --- Booking Methods ---
    getBookings: async () => {
        if (USE_MOCK) return getStoredData('kiosk_mock_bookings', []);
        const res = await axiosClient.get('/bookings');
        return res.data;
    },

    bookUnit: async (bookingData) => {
        // Expected Payload: { towerId, unitNumber, customerName, phoneNumber }
        if (USE_MOCK) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const towers = getStoredData('kiosk_mock_inventory', initialMockTowers);
                    let targetUnit = null;

                    const updatedTowers = towers.map((tower) => {
                        if (tower.id === bookingData.towerId) {
                            return {
                                ...tower,
                                units: tower.units.map((unit) => {
                                    if (unit.unitNumber === bookingData.unitNumber) {
                                        targetUnit = unit;
                                        if (unit.booked || unit.status === 'BOOKED') {
                                            return unit;
                                        }
                                        return { ...unit, booked: true, status: 'BOOKED', bookedBy: bookingData.customerName };
                                    }
                                    return unit;
                                }),
                            };
                        }
                        return tower;
                    });

                    if (!targetUnit || targetUnit.booked || targetUnit.status === 'BOOKED') {
                        return reject({
                            response: { data: { message: 'This unit has already been booked by another customer!' } },
                        });
                    }

                    setStoredData('kiosk_mock_inventory', updatedTowers);

                    const bookings = getStoredData('kiosk_mock_bookings', []);
                    const newBooking = { ...bookingData, id: 'BK-' + Date.now() };
                    bookings.push(newBooking);
                    setStoredData('kiosk_mock_bookings', bookings);

                    if (window.kioskBroadcastChannel) {
                        window.kioskBroadcastChannel.postMessage({
                            type: 'INVENTORY_UPDATE',
                            updatedUnit: { ...targetUnit, booked: true, status: 'BOOKED' },
                        });
                    }

                    resolve({
                        success: true,
                        message: 'Booking successfully confirmed!',
                        bookingId: newBooking.id,
                    });
                }, 400);
            });
        }

        const res = await axiosClient.post('/book', bookingData);
        return res.data;
    },

    // Add a single flat/unit to a specific floor in a tower
    addUnitToTower: async (towerId, newUnitPayload) => {
        try {
            // Real API Call (Uncomment when endpoint is live):
            // const response = await axios.post(`/api/towers/${towerId}/units`, newUnitPayload);
            // return response.data;

            // Mock Fallback implementation for instant frontend updates:
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true, data: newUnitPayload });
                }, 300);
            });
        } catch (error) {
            console.error('API Error in addUnitToTower:', error);
            throw error;
        }
    },

    updateBooking: async (bookingId, bookingData) => {
        if (USE_MOCK) {
            const bookings = getStoredData('kiosk_mock_bookings', []);
            const updated = bookings.map((b) => (b.id === bookingId ? { ...b, ...bookingData } : b));
            setStoredData('kiosk_mock_bookings', updated);
            return bookingData;
        }
        const res = await axiosClient.put(`/bookings/${bookingId}`, bookingData);
        return res.data;
    },

    patchBooking: async (bookingId, partialData) => {
        if (USE_MOCK) {
            const bookings = getStoredData('kiosk_mock_bookings', []);
            const updated = bookings.map((b) => (b.id === bookingId ? { ...b, ...partialData } : b));
            setStoredData('kiosk_mock_bookings', updated);
            return updated.find((b) => b.id === bookingId);
        }
        const res = await axiosClient.patch(`/bookings/${bookingId}`, partialData);
        return res.data;
    },

    deleteBooking: async (bookingId) => {
        if (USE_MOCK) {
            const bookings = getStoredData('kiosk_mock_bookings', []);
            const filtered = bookings.filter((b) => b.id !== bookingId);
            setStoredData('kiosk_mock_bookings', filtered);
            return { success: true };
        }
        const res = await axiosClient.delete(`/bookings/${bookingId}`);
        return res.data;
    },
};