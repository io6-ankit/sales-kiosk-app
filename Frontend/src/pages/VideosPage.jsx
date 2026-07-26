import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import VideocamIcon from '@mui/icons-material/Videocam';
import { useKiosk } from '../hooks/useKiosk';
import { kioskApi } from '../api/kioskApi';
import { WebSocketContext } from '../context/WebSocketContext';

export const VideosPage = () => {
  const { activeVideo, setActiveVideo, showNotification, role } = useKiosk();
  const { lastMessage } = useContext(WebSocketContext);

  const [videoItems, setVideoItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Form Modal State (Unchanged)
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', url: '', description: '' });

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await kioskApi.getVideos();
      setVideoItems(data || []);
    } catch (err) {
      showNotification('Failed to load video walkthroughs', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Real-Time WebSocket Updates
  useEffect(() => {
    if (lastMessage && lastMessage.type && lastMessage.type.startsWith('VIDEO_')) {
      console.log('Real-time video page changes detected, fetching fresh data...');
      fetchVideos();
    }
  }, [lastMessage, fetchVideos]);

  // Search Filter Computation
  const filteredVideoItems = useMemo(() => {
    if (!searchQuery.trim()) return videoItems;
    const q = searchQuery.toLowerCase();
    return videoItems.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  }, [videoItems, searchQuery]);

  const handleOpenAdd = () => {
    setEditItem(null);
    setFormData({ title: '', url: '', description: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (e, item) => {
    e.stopPropagation();
    setEditItem(item);
    setFormData({
      title: item.title || '',
      url: item.url || item.videoUrl || '',
      description: item.description || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await kioskApi.deleteVideo(id);
      showNotification('Video deleted', 'info');
      fetchVideos();
    } catch (err) {
      showNotification('Failed to delete video', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextSequence = videoItems.length + 1;
    const generatedId = editItem
      ? editItem.id
      : `VID-${String(nextSequence).padStart(3, '0')}`;
    try {
      const payload = {
        id: generatedId,
        title: formData.title,
        url: formData.url,
        description: formData.description,
        type: 'VIDEO',
      };

      if (editItem) {
        await kioskApi.updateVideo(editItem.id, payload);
        showNotification('Video updated!', 'success');
      } else {
        await kioskApi.addVideo(payload);
        showNotification('Video added!', 'success');
      }
      setModalOpen(false);
      fetchVideos();
    } catch (err) {
      showNotification('Failed to save video', 'error');
    }
  };

  const handleCardClick = (item) => {
    if (role === 'CONTROLLER') {
      setActiveVideo(item);
    }
  };

  const handleCloseVideoPlayer = () => {
    if (role === 'CONTROLLER') {
      setActiveVideo(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Virtual Video Walkthroughs
        </Typography>
        {role === 'CONTROLLER' && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
            Add Video
          </Button>
        )}
      </Box>

      {/* Search Input Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search videos by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
        />
      </Box>

      {/* Loading / Empty / Video Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2].map((n) => (
            <Grid item xs={12} sm={6} key={n}>
              <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : filteredVideoItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {searchQuery ? `No videos found matching "${searchQuery}"` : 'No video walkthroughs available.'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredVideoItems.map((item) => {
            const isSelected = activeVideo?.id === item.id;
            const videoSrc = item.url || item.videoUrl;

            // Checking if user provided an explicit cover image property, or fallback to auto-first-frame
            const coverImage = item.thumbnail || item.coverImage || item.imageUrl;

            return (
              <Grid item xs={12} sm={6} key={item.id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    cursor: role === 'CONTROLLER' ? 'pointer' : 'default',
                    position: 'relative',
                    transition: '0.3s',
                    border: isSelected ? '3px solid #1976d2' : '3px solid transparent',
                    boxShadow: isSelected ? 8 : 1,
                    '&:hover': { transform: 'scale(1.02)', boxShadow: 6 },
                  }}
                  onClick={() => handleCardClick(item)}
                >
                  <Box
                    sx={{
                      height: 200,
                      position: 'relative',
                      overflow: 'hidden',
                      background: 'radial-gradient(circle, #2a2a2a 0%, #111111 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Render Thumbnail or Auto Preview Frame */}
                    {coverImage ? (
                      <Box
                        component="img"
                        src={coverImage}
                        alt={item.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                        }}
                      />
                    ) : videoSrc ? (
                      <Box
                        component="video"
                        src={`${videoSrc}#t=0.5`}
                        preload="metadata"
                        muted
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          pointerEvents: 'none',
                        }}
                      />
                    ) : (
                      <VideocamIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.15)', position: 'absolute' }} />
                    )}

                    {/* Dark Overlay for contrast */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.35)',
                        zIndex: 1,
                      }}
                    />

                    {/* Centered Play Button */}
                    <PlayCircleOutlinedIcon
                      sx={{
                        fontSize: 64,
                        color: '#1976d2',
                        bgcolor: 'rgba(255,255,255,0.85)',
                        borderRadius: '50%',
                        zIndex: 2,
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.1)' },
                      }}
                    />
                  </Box>

                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: '70%' }}>
                        {item.title}
                      </Typography>
                      {role === 'CONTROLLER' && (
                        <Box onClick={(e) => e.stopPropagation()}>
                          <IconButton size="small" color="primary" onClick={(e) => handleOpenEdit(e, item)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={(e) => handleDelete(e, item.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    {item.description && (
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.5 }}>
                        {item.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Synchronized Video Player Lightbox Dialog */}
      <Dialog
        open={Boolean(activeVideo)}
        onClose={handleCloseVideoPlayer}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { bgcolor: 'black', borderRadius: 2, overflow: 'hidden' },
        }}
      >
        <DialogContent sx={{ position: 'relative', p: 0, bgcolor: '#000', display: 'flex', justifyContent: 'center' }}>
          {role === 'CONTROLLER' && (
            <IconButton
              onClick={handleCloseVideoPlayer}
              sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)' }}
            >
              <CloseIcon />
            </IconButton>
          )}
          {activeVideo && (
            <Box
              component="video"
              controls
              autoPlay
              src={activeVideo.url || activeVideo.videoUrl}
              sx={{ width: '100%', maxHeight: '80vh', outline: 'none' }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* CRUD Form Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">{editItem ? 'Edit Video' : 'Add Video'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              size="small"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              label="Video Stream / MP4 URL"
              size="small"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
            <TextField
              label="Description"
              size="small"
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};