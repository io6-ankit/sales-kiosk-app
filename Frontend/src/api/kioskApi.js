import { axiosClient } from './axiosClient';

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
        const res = await axiosClient.get('/gallery');
        return res.data;
    },

    getGalleryById: async (id) => {
        const res = await axiosClient.get(`/gallery/${id}`);
        return res.data;
    },

    addGalleryItem: async (galleryData) => {
        const res = await axiosClient.post('/gallery', galleryData);
        return res.data;
    },

    updateGalleryItem: async (id, galleryData) => {
        const res = await axiosClient.put(`/gallery/${id}`, galleryData);
        return res.data;
    },

    patchGalleryItem: async (id, partialData) => {
        const res = await axiosClient.patch(`/gallery/${id}`, partialData);
        return res.data;
    },

    deleteGalleryItem: async (id) => {
        const res = await axiosClient.delete(`/gallery/${id}`);
        return res.data;
    },

    // --- Video APIs ---
    getVideos: async () => {
        const res = await axiosClient.get('/videos');
        return res.data;
    },

    getVideoById: async (id) => {
        
        const res = await axiosClient.get(`/videos/${id}`);
        return res.data;
    },

    addVideo: async (videoData) => {
        const res = await axiosClient.post('/videos', videoData);
        return res.data;
    },

    updateVideo: async (id, videoData) => {
        const res = await axiosClient.put(`/videos/${id}`, videoData);
        return res.data;
    },

    patchVideo: async (id, partialData) => {
        const res = await axiosClient.patch(`/videos/${id}`, partialData);
        return res.data;
    },

    deleteVideo: async (id) => {
        const res = await axiosClient.delete(`/videos/${id}`);
        return res.data;
    },

    // --- Inventory & Tower APIs ---
    getInventory: async () => {
        const res = await axiosClient.get('/inventory');
        return res.data;
    },

    addTower: async (towerData) => {
        const res = await axiosClient.post('/inventory/tower', towerData);
        return res.data;
    },

    updateTower: async (towerId, towerData) => {
        const res = await axiosClient.put(`/inventory/tower/${towerId}`, towerData);
        return res.data;
    },

    patchTower: async (towerId, partialData) => {
        const res = await axiosClient.patch(`/inventory/tower/${towerId}`, partialData);
        return res.data;
    },

    patchUnitInTower: async (towerId, unitNumber, unitData) => {
        const res = await axiosClient.patch(`/inventory/tower/${towerId}/unit/${unitNumber}`, unitData);
        return res.data;
    },

    deleteTower: async (towerId) => {
        const res = await axiosClient.delete(`/inventory/tower/${towerId}`);
        return res.data;
    },

    // --- Booking Methods ---
    getBookings: async () => {
        const res = await axiosClient.get('/bookings');
        return res.data;
    },

    bookUnit: async (bookingData) => {
        // Expected Payload: { towerId, unitNumber, customerName, phoneNumber }
        const res = await axiosClient.post('/book', bookingData);
        return res.data;
    },

    // Add a single flat/unit to a specific floor in a tower
    addUnitToTower: async (towerId, newUnitPayload) => {
        try {
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
        const res = await axiosClient.put(`/bookings/${bookingId}`, bookingData);
        return res.data;
    },

    patchBooking: async (bookingId, partialData) => {
        const res = await axiosClient.patch(`/bookings/${bookingId}`, partialData);
        return res.data;
    },

    deleteBooking: async (bookingId) => {
        const res = await axiosClient.delete(`/bookings/${bookingId}`);
        return res.data;
    },
};