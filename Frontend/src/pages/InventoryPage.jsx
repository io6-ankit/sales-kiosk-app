import React, { useState, useContext, useEffect, useMemo } from 'react';
import {
    Container,
    Tabs,
    Tab,
    Grid,
    Box,
    Typography,
    TextField,
    MenuItem,
    Skeleton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Divider,
    Chip,
    Paper,
    InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LayersIcon from '@mui/icons-material/Layers';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { useKiosk } from '../hooks/useKiosk';
import { UnitCard } from '../components/inventory/UnitCard';
import { BookingModal } from '../components/inventory/BookingModal';
import { MortgageCalculatorWidget } from '../components/common/MortgageCalculatorWidget';
import { kioskApi } from '../api/kioskApi';
import { WebSocketContext } from '../context/WebSocketContext';

export const InventoryPage = () => {
    const { towers, selectedTowerId, setSelectedTowerId, loading, role, showNotification, fetchInventory } = useKiosk();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const { lastMessage } = useContext(WebSocketContext);

    // Sync via WebSockets
    useEffect(() => {
        if (lastMessage) {
            const eventType = lastMessage.type || '';
            if (
                eventType.includes('INVENTORY') ||
                eventType.includes('TOWER') ||
                eventType.includes('UNIT') ||
                eventType.includes('BOOKING') ||
                eventType === 'SYNC_MIRROR'
            ) {
                console.log('🏢 Inventory Event Detected! Fetching fresh data...', eventType);
                fetchInventory();
            }
        }
    }, [lastMessage, fetchInventory]);

    // Tower Modal State 
    const [towerModalOpen, setTowerModalOpen] = useState(false);
    const [editingTowerId, setEditingTowerId] = useState(null);
    const [towerForm, setTowerForm] = useState({
        name: '',
        location: '',
        totalFloors: 5,
        unitsPerFloor: 2,
        basePrice: 150000,
        unitType: '2BHK',
        description: '',
    });

    // Add Flat to Floor Modal State
    const [addFlatModalOpen, setAddFlatModalOpen] = useState(false);
    const [targetFloor, setTargetFloor] = useState(1);
    const [flatForm, setFlatForm] = useState({
        unitNumber: '',
        type: '2BHK',
        price: 150000,
        status: 'AVAILABLE',
    });

    const currentTower = towers.find((t) => t.id === selectedTowerId) || towers[0];

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setTowerForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFlatFormChange = (e) => {
        const { name, value } = e.target;
        setFlatForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleOpenAddModal = () => {
        setEditingTowerId(null);
        setTowerForm({
            name: '',
            location: '',
            totalFloors: 5,
            unitsPerFloor: 2,
            basePrice: 150000,
            unitType: '2BHK',
            description: '',
        });
        setTowerModalOpen(true);

    };

    const handleOpenEditModal = () => {
        if (!currentTower) return;
        setEditingTowerId(currentTower.id);
        setTowerForm({
            name: currentTower.name || '',
            location: currentTower.location || '',
            totalFloors: currentTower.totalFloors || 5,
            unitsPerFloor: currentTower.unitsPerFloor || 2,
            basePrice: currentTower.units?.[0]?.price || 150000,
            unitType: currentTower.units?.[0]?.type || '2BHK',
            description: currentTower.description || '',
        });
        setTowerModalOpen(true);
    };

    // Group Units by Floor dynamically
    const groupedUnits = useMemo(() => {
        if (!currentTower?.units) return {};

        const filtered = currentTower.units.filter((unit) => {
            const matchesSearch = unit.unitNumber.toString().toLowerCase().includes(searchTerm.toLowerCase());
            const isBooked = unit.booked || unit.status === 'BOOKED';
            const matchesStatus =
                statusFilter === 'ALL' ||
                (statusFilter === 'AVAILABLE' && !isBooked) ||
                (statusFilter === 'BOOKED' && isBooked);
            return matchesSearch && matchesStatus;
        });

        return filtered.reduce((acc, unit) => {
            const floorKey = unit.floor || (unit.unitNumber ? parseInt(unit.unitNumber.toString()[0], 10) : 1);
            if (!acc[floorKey]) acc[floorKey] = [];
            acc[floorKey].push(unit);
            return acc;
        }, {});
    }, [currentTower, searchTerm, statusFilter]);

    const sortedFloors = useMemo(
        () => Object.keys(groupedUnits).sort((a, b) => Number(a) - Number(b)),
        [groupedUnits]
    );

    // Open Add Flat Modal for specific floor
    const handleOpenAddFlatModal = (floorNum) => {
        const floorKey = Number(floorNum);
        setTargetFloor(floorKey);

        const floorUnits = groupedUnits[floorKey] || [];
        const nextSeq = floorUnits.length + 1;
        const suggestedNum = `${floorKey}${String(nextSeq).padStart(2, '0')}`;

        setFlatForm({
            unitNumber: suggestedNum,
            type: currentTower?.units?.[0]?.type || '2BHK',
            price: currentTower?.units?.[0]?.price || 150000,
            status: 'AVAILABLE',
        });
        setAddFlatModalOpen(true);
    };

    // Submit Handler for Adding a New Flat
    const handleAddFlatSubmit = async (e) => {
        e.preventDefault();
        if (!flatForm.unitNumber || !currentTower) return;

        const newUnitPayload = {
            id: `UNIT-${Date.now()}`,
            unitNumber: flatForm.unitNumber,
            floor: targetFloor,
            type: flatForm.type,
            price: Number(flatForm.price),
            booked: flatForm.status === 'BOOKED',
            status: flatForm.status,
        };

        try {
            if (kioskApi.addUnitToTower) {
                await kioskApi.addUnitToTower(currentTower.id, newUnitPayload);
            } else if (currentTower.units) {
                currentTower.units.push(newUnitPayload);
            }

            showNotification(`Flat #${flatForm.unitNumber} added to Floor ${targetFloor}!`, 'success');
            setAddFlatModalOpen(false);
            fetchInventory();
        } catch (err) {
            showNotification('Failed to add flat to floor', 'error');
        }
    };

    // Dynamic Initial Units Generator
    const generateInitialUnits = () => {
        const units = [];
        const floors = Number(towerForm.totalFloors) || 1;
        const perFloor = Number(towerForm.unitsPerFloor) || 1;

        for (let f = 1; f <= floors; f++) {
            for (let u = 1; u <= perFloor; u++) {
                const unitNum = `${f}${String(u).padStart(2, '0')}`;
                units.push({
                    unitNumber: unitNum,
                    floor: f,
                    type: towerForm.unitType,
                    price: Number(towerForm.basePrice),
                    booked: false,
                    status: 'AVAILABLE',
                });
            }
        }
        return units;
    };

    const handleSubmitTower = async (e) => {
        e.preventDefault();
        if (!towerForm.name) return;

        try {
            if (editingTowerId) {
                const payload = {
                    id: editingTowerId,
                    name: towerForm.name,
                    location: towerForm.location,
                    totalFloors: Number(towerForm.totalFloors),
                    description: towerForm.description,
                };

                await (kioskApi.updateTower ? kioskApi.updateTower(editingTowerId, payload) : kioskApi.addTower(payload));
                showNotification(`Tower '${towerForm.name}' updated successfully!`, 'success');
            } else {
                const nextSequence = towers.length + 1;
                const generatedTowerId = `TWR-${String(nextSequence).padStart(3, '0')}`;
                const generatedUnits = generateInitialUnits();

                const payload = {
                    id: generatedTowerId,
                    name: towerForm.name,
                    location: towerForm.location || 'Block A',
                    totalFloors: Number(towerForm.totalFloors),
                    description: towerForm.description,
                    totalUnitsCount: generatedUnits.length,
                    units: generatedUnits,
                };

                await kioskApi.addTower(payload);
                showNotification(`Tower '${towerForm.name}' created with ${generatedUnits.length} flats!`, 'success');
            }

            setTowerModalOpen(false);
            fetchInventory();
        } catch (err) {
            showNotification('Failed to save tower details', 'error');
        }
    };

    const handleDeleteTower = async (towerId, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}? All associated flat records will be removed.`)) return;
        try {
            await kioskApi.deleteTower(towerId);
            showNotification(`Tower '${name}' deleted successfully!`, 'info');
            fetchInventory();
        } catch (err) {
            showNotification('Failed to delete tower', 'error');
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
            {/* Header Banner */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 4,
                    pb: 2,
                    borderBottom: '2px solid',
                    borderColor: 'divider',
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight="800" color="primary.main" sx={{ letterSpacing: '-0.5px' }}>
                        Interactive Property Directory
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        View floor-wise flat availability, manage towers, and perform real-time bookings.
                    </Typography>
                </Box>

                {role === 'CONTROLLER' && (
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAddModal}
                        sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 700,
                            boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.39)',
                            px: 3,
                        }}
                    >
                        Add New Tower
                    </Button>
                )}
            </Box>

            {/* Tower Selector Tabs */}
            {loading ? (
                <Skeleton variant="rectangular" height={56} sx={{ mb: 4, borderRadius: 2 }} />
            ) : towers.length > 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Tabs
                        value={selectedTowerId || towers[0]?.id}
                        onChange={(_, val) => setSelectedTowerId(val)}
                        variant="scrollable"
                        scrollButtons="auto"
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{
                            flexGrow: 1,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                minHeight: '48px',
                                borderRadius: '8px',
                                mx: 0.5,
                            },
                        }}
                    >
                        {towers.map((tower) => (
                            <Tab
                                key={tower.id}
                                value={tower.id}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BusinessIcon fontSize="small" />
                                        <span>{tower.name}</span>
                                        <Chip
                                            label={`${tower.units?.length || 0} Flats`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
                                        />
                                    </Box>
                                }
                            />
                        ))}
                    </Tabs>

                    {role === 'CONTROLLER' && currentTower && (
                        <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                            <IconButton
                                color="primary"
                                title={`Edit ${currentTower.name}`}
                                onClick={handleOpenEditModal}
                                sx={{ bgcolor: 'primary.50', '&:hover': { bgcolor: 'primary.100' } }}
                            >
                                <EditTwoToneIcon />
                            </IconButton>
                            <IconButton
                                color="error"
                                title={`Delete ${currentTower.name}`}
                                onClick={() => handleDeleteTower(currentTower.id, currentTower.name)}
                                sx={{ bgcolor: 'error.50', '&:hover': { bgcolor: 'error.100' } }}
                            >
                                <DeleteOutlinedIcon />
                            </IconButton>
                        </Box>
                    )}
                </Paper>
            ) : (
                <Paper sx={{ p: 4, textAlign: 'center', mb: 4, borderRadius: 3 }}>
                    <Typography color="text.secondary">No towers configured. Click "Add New Tower" to initialize inventory.</Typography>
                </Paper>
            )}

            {/* Filters & Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    placeholder="Search Flat # (e.g. 101)"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 260 }}
                />

                <TextField
                    select
                    label="Filter Status"
                    size="small"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FilterListIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 180 }}
                >
                    <MenuItem value="ALL">All Flats</MenuItem>
                    <MenuItem value="AVAILABLE">Available Only</MenuItem>
                    <MenuItem value="BOOKED">Booked Only</MenuItem>
                </TextField>

                {currentTower?.location && (
                    <Chip
                        icon={<LocationOnIcon fontSize="small" />}
                        label={`Location: ${currentTower.location}`}
                        variant="outlined"
                        color="secondary"
                        sx={{ ml: 'auto', fontWeight: 600 }}
                    />
                )}
            </Box>

            {/* Floor-Wise Units Rendering */}
            {loading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((n) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={n}>
                            <Skeleton variant="rectangular" height={230} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : sortedFloors.length > 0 ? (
                sortedFloors.map((floorNum) => {
                    const floorUnits = groupedUnits[floorNum];
                    const totalFlatsOnFloor = floorUnits.length;
                    const availableFlatsCount = floorUnits.filter((u) => !u.booked && u.status !== 'BOOKED').length;
                    const bookedFlatsCount = totalFlatsOnFloor - availableFlatsCount;

                    return (
                        <Box key={`floor-${floorNum}`} sx={{ mb: 5 }}>
                            {/* Floor Header Bar */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    px: 2.5,
                                    mb: 2.5,
                                    borderRadius: 2,
                                    bgcolor: 'grey.100',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: 1.5,
                                    borderLeft: '5px solid',
                                    borderLeftColor: 'primary.main',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <LayersIcon color="primary" />
                                    <Typography variant="h6" fontWeight="800" color="text.primary">
                                        Floor - {floorNum}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                    <Chip
                                        label={`Available: ${availableFlatsCount}`}
                                        color="success"
                                        size="small"
                                        sx={{ fontWeight: 700 }}
                                    />
                                    <Chip
                                        label={`Booked: ${bookedFlatsCount}`}
                                        color={bookedFlatsCount > 0 ? 'error' : 'default'}
                                        size="small"
                                        sx={{ fontWeight: 700 }}
                                    />
                                    <Chip
                                        label={`Total Flats: ${totalFlatsOnFloor}`}
                                        variant="outlined"
                                        size="small"
                                        sx={{ fontWeight: 700 }}
                                    />

                                    {role === 'CONTROLLER' && (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            startIcon={<AddCircleOutlinedIcon />}
                                            onClick={() => handleOpenAddFlatModal(floorNum)}
                                            sx={{
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                ml: 1,
                                                bgcolor: 'background.paper',
                                            }}
                                        >
                                            Add Flat to Floor {floorNum}
                                        </Button>
                                    )}
                                </Box>
                            </Paper>

                            {/* Floor Units Grid */}
                            <Grid container spacing={3}>
                                {floorUnits.map((unit) => (
                                    <Grid item key={unit.id || unit.unitNumber}>
                                        <UnitCard unit={unit} towerId={currentTower?.id} floorNum={floorNum} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    );
                })
            ) : (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, borderStyle: 'dashed', borderWidth: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                        No flats found matching criteria
                    </Typography>
                </Paper>
            )}

            {/* Widgets & Modals */}
            <Box sx={{ mt: 6 }}>
                <MortgageCalculatorWidget />
            </Box>

            <BookingModal />

            {/* Create / Edit Tower */}
            <Dialog
                open={towerModalOpen}
                onClose={() => setTowerModalOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            {editingTowerId ? `Edit ${towerForm.name}` : 'Add New Tower Configuration'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Configure parameters to update or auto-generate dynamic inventory flats.
                        </Typography>
                    </Box>
                    <IconButton onClick={() => setTowerModalOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Divider />

                <form onSubmit={handleSubmitTower}>
                    <DialogContent sx={{ py: 3 }}>
                        <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                            1. TOWER METRICS & IDENTIFICATION
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="name"
                                    label="Tower Name"
                                    placeholder="e.g. Tower A"
                                    size="small"
                                    fullWidth
                                    required
                                    value={towerForm.name}
                                    onChange={handleFormChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="location"
                                    label="Location / Block"
                                    placeholder="e.g. North Wing"
                                    size="small"
                                    fullWidth
                                    value={towerForm.location}
                                    onChange={handleFormChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="description"
                                    label="Tower Description"
                                    placeholder="e.g. Luxury residences with club view"
                                    size="small"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={towerForm.description}
                                    onChange={handleFormChange}
                                />
                            </Grid>
                        </Grid>

                        {!editingTowerId && (
                            <>
                                <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                                    2. DYNAMIC FLAT GENERATION SCHEME
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            name="totalFloors"
                                            label="Total Floors"
                                            type="number"
                                            size="small"
                                            fullWidth
                                            required
                                            inputProps={{ min: 1, max: 100 }}
                                            value={towerForm.totalFloors}
                                            onChange={handleFormChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            name="unitsPerFloor"
                                            label="Flats Per Floor"
                                            type="number"
                                            size="small"
                                            fullWidth
                                            required
                                            inputProps={{ min: 1, max: 20 }}
                                            value={towerForm.unitsPerFloor}
                                            onChange={handleFormChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            name="unitType"
                                            select
                                            label="Flat Type"
                                            size="small"
                                            fullWidth
                                            value={towerForm.unitType}
                                            onChange={handleFormChange}
                                        >
                                            <MenuItem value="1BHK">1BHK Apartment</MenuItem>
                                            <MenuItem value="2BHK">2BHK Standard</MenuItem>
                                            <MenuItem value="3BHK">3BHK Luxury</MenuItem>
                                            <MenuItem value="Penthouse">Penthouse Suite</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            name="basePrice"
                                            label="Base Price ($)"
                                            type="number"
                                            size="small"
                                            fullWidth
                                            required
                                            value={towerForm.basePrice}
                                            onChange={handleFormChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Flats Auto-Generation Summary:
                                            </Typography>
                                            <Typography variant="body2" fontWeight="bold" color="success.main">
                                                Total {Number(towerForm.totalFloors || 0) * Number(towerForm.unitsPerFloor || 0)} flats will be created.
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </DialogContent>

                    <Divider />

                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button onClick={() => setTowerModalOpen(false)} color="inherit">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" sx={{ px: 3, fontWeight: 'bold' }}>
                            {editingTowerId ? 'Update Tower' : 'Create Tower'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Add Flat to Floor Modal */}
            <Dialog
                open={addFlatModalOpen}
                onClose={() => setAddFlatModalOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            Add Flat to Floor {targetFloor}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {currentTower?.name || 'Selected Tower'}
                        </Typography>
                    </Box>
                    <IconButton onClick={() => setAddFlatModalOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Divider />

                <form onSubmit={handleAddFlatSubmit}>
                    <DialogContent sx={{ py: 2.5 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="unitNumber"
                                    label="Flat Number"
                                    placeholder="e.g. 105"
                                    size="small"
                                    fullWidth
                                    required
                                    value={flatForm.unitNumber}
                                    onChange={handleFlatFormChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="type"
                                    select
                                    label="Unit Layout Type"
                                    size="small"
                                    fullWidth
                                    value={flatForm.type}
                                    onChange={handleFlatFormChange}
                                >
                                    <MenuItem value="1BHK">1BHK Apartment</MenuItem>
                                    <MenuItem value="2BHK">2BHK Standard</MenuItem>
                                    <MenuItem value="3BHK">3BHK Luxury</MenuItem>
                                    <MenuItem value="Penthouse">Penthouse Suite</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="price"
                                    label="Unit Price ($)"
                                    type="number"
                                    size="small"
                                    fullWidth
                                    required
                                    value={flatForm.price}
                                    onChange={handleFlatFormChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="status"
                                    select
                                    label="Initial Status"
                                    size="small"
                                    fullWidth
                                    value={flatForm.status}
                                    onChange={handleFlatFormChange}
                                >
                                    <MenuItem value="AVAILABLE">Available</MenuItem>
                                    <MenuItem value="BOOKED">Booked</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <Divider />

                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button onClick={() => setAddFlatModalOpen(false)} color="inherit">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" sx={{ px: 3, fontWeight: 'bold' }}>
                            Add Flat
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
};