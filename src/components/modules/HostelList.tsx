import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Fab,
  Fade,
  Backdrop,
  useTheme,
  Paper,
  Stack,
  Button,
  Skeleton
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import HostelCard from './HostelCard';
import HostelSearch from './HostelSearch';
import { getHostels, searchHostels } from '../auth/api/hostelApi';
import type { HostelFilters } from '../auth/api/hostelApi';

interface HostelListProps {
  onAddHostel?: () => void;
  onViewDetails: (id: string) => void;
  showAddButton?: boolean;
  title?: string;
}

const HostelList: React.FC<HostelListProps> = ({
  onAddHostel,
  onViewDetails,
  showAddButton = false,
  title = "All Hostels"
}) => {
  const theme = useTheme();
  const [hostels, setHostels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HostelFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteHostels');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const loadHostels = async (searchFilters?: HostelFilters) => {
    try {
      setError(null);
      const response = searchFilters && Object.keys(searchFilters).length > 0
        ? await searchHostels(searchFilters)
        : await getHostels();

      if (response.success) {
        setHostels(response.data);
      } else {
        setError('Failed to load hostels');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading hostels');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHostels(filters);
  }, [filters]);

  const handleSearch = (searchFilters: HostelFilters) => {
    setFilters(searchFilters);
    setLoading(true);
  };

  const handleAddHostel = () => {
    setRefreshing(true);
    loadHostels(filters);
  };

  const handleToggleFavorite = (hostelId: string) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(hostelId)) {
      newFavorites.delete(hostelId);
    } else {
      newFavorites.add(hostelId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('favoriteHostels', JSON.stringify([...newFavorites]));
  };

  const handleShare = (hostelId: string) => {
    const hostel = hostels.find(h => h._id === hostelId);
    if (hostel && navigator.share) {
      navigator.share({
        title: hostel.name,
        text: `Check out this hostel: ${hostel.name} in ${hostel.address.city}`,
        url: window.location.href + `/hostels/${hostelId}`
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href + `/hostels/${hostelId}`);
    }
  };

  // const LoadingSkeleton = () => (
  //   <Grid container spacing={3}>
  //     {[...Array(6)].map((_, index) => (
  //       <Grid item xs={12} sm={6} md={4} key={index}>
  //         <Paper sx={{ p: 2, height: 400 }}>
  //           <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
  //           <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
  //           <Skeleton variant="text" height={24} sx={{ mb: 2 }} />
  //           <Stack spacing={1}>
  //             <Skeleton variant="text" height={20} />
  //             <Skeleton variant="text" height={20} />
  //             <Skeleton variant="rectangular" height={40} />
  //           </Stack>
  //         </Paper>
  //       </Grid>
  //     ))}
  //   </Grid>
  // );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {title}
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ borderRadius: 2 }}
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleAddHostel}
              sx={{ borderRadius: 2 }}
            >
              Add Hostel
            </Button>
          </Stack>
        </Box>

        {/* Search and Filters */}
        <Fade in={showFilters}>
          <Box sx={{ mb: 3 }}>
            <HostelSearch onSearch={handleSearch} />
          </Box>
        </Fade>

        {/* Results Summary */}
        {!loading && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {hostels.length} hostel{hostels.length !== 1 ? 's' : ''} found
          </Typography>
        )}
      </Box>

      {/* Content */}
      {hostels.length === 0 ? (
        <Paper
          sx={{
            p: 8,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.action.hover})`
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hostels found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search filters or add a new hostel.
          </Typography>
          {showAddButton && onAddHostel && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddHostel}
              sx={{ borderRadius: 2 }}
            >
              Add First Hostel
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {hostels.map((hostel) => (
            <Grid item xs={12} sm={6} md={4} key={hostel._id}>
              <Fade in timeout={300}>
                <Box>
                  <HostelCard
                    hostel={hostel}
                    onViewDetails={onViewDetails}
                    onFavorite={handleToggleFavorite}
                    onShare={handleShare}
                    isFavorited={favorites.has(hostel._id)}
                  />
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Add Button */}
      {showAddButton && onAddHostel && (
        <Fab
          color="primary"
          onClick={onAddHostel}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            }
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={refreshing}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default HostelList;
