import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useKiosk } from '../hooks/useKiosk';
import { kioskApi } from '../api/kioskApi';
import { WebSocketContext } from '../context/WebSocketContext';

export const GalleryPage = () => {
  const { activeImage, setActiveImage, showNotification, role } = useKiosk();
  const { lastMessage } = useContext(WebSocketContext);

  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Form Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', url: '', description: '' });

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      const data = await kioskApi.getGallery();
      setGalleryItems(data || []);
    } catch (err) {
      showNotification('Failed to load gallery images', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Listen to WebSocket CRUD Updates in Real-Time 
  useEffect(() => {
    if (lastMessage && lastMessage.type && lastMessage.type.startsWith('GALLERY_')) {
      console.log('Real-time gallery changes detected, fetching fresh data...');
      fetchGallery();
    }
  }, [lastMessage, fetchGallery]);

  //  Compute filtered list without mutating or replacing galleryItems
  const filteredGalleryItems = useMemo(() => {
    if (!searchQuery.trim()) return galleryItems;
    const q = searchQuery.toLowerCase();
    return galleryItems.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  }, [galleryItems, searchQuery]);

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
      url: item.url || item.imageUrl || '',
      description: item.description || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      await kioskApi.deleteGalleryItem(id);
      showNotification('Gallery item deleted', 'info');
      fetchGallery();
    } catch (err) {
      showNotification('Failed to delete item', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextSequence = galleryItems.length + 1;
    const generatedId = editItem
      ? editItem.id
      : `IMG-${String(nextSequence).padStart(3, '0')}`;
    try {
      const payload = {
        id: generatedId,
        title: formData.title,
        url: formData.url,
        description: formData.description,
        type: 'IMAGE',
      };

      if (editItem) {
        await kioskApi.updateGalleryItem(editItem.id, payload);
        showNotification('Gallery item updated!', 'success');
      } else {
        await kioskApi.addGalleryItem(payload);
        showNotification('Gallery item added!', 'success');
      }
      setModalOpen(false);
      fetchGallery();
    } catch (err) {
      showNotification('Failed to save gallery item', 'error');
    }
  };

  const handleCardClick = (item) => {
    // Only Controller triggers image selection to mirror across screens 
    if (role === 'CONTROLLER') {
      setActiveImage(item);
    }
  };

  const handleCloseLightbox = () => {
    if (role === 'CONTROLLER') {
      setActiveImage(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Project Image Showcase
        </Typography>
        {role === 'CONTROLLER' && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
            Add Image
          </Button>
        )}
      </Box>

      {/* Search Bar Added cleanly above grid without disturbing other elements */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search images by title or description..."
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

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((n) => (
            <Grid item xs={12} sm={6} md={4} key={n}>
              <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {filteredGalleryItems.map((item) => {
            const imageUrl = item.url || item.imageUrl;
            const isSelected = activeImage?.id === item.id;

            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
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
                  <CardMedia component="img" height="200" image={imageUrl} alt={item.title} />
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

      {/* Synchronized Image Lightbox Overlay Modal */}
      <Dialog
        open={Boolean(activeImage)}
        onClose={handleCloseLightbox}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { bgcolor: 'black', borderRadius: 2, overflow: 'hidden' },
        }}
      >
        <DialogContent sx={{ position: 'relative', p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {role === 'CONTROLLER' && (
            <IconButton
              onClick={handleCloseLightbox}
              sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)' }}
            >
              <CloseIcon />
            </IconButton>
          )}
          {activeImage && (
            <Box
              component="img"
              src={activeImage.url || activeImage.imageUrl}
              alt={activeImage.title || 'Selected Image'}
              sx={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* CRUD Form Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">{editItem ? 'Edit Gallery Item' : 'Add Gallery Item'}</DialogTitle>
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
              label="Image URL"
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