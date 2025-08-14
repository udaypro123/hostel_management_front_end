import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Rating,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  Stack,
  Divider
} from '@mui/material';
import {
  LocationOn,
  Wifi,
  LocalDining,
  Security,
  DirectionsCar,
  FitnessCenter,
  LocalLibrary,
  LocalHospital,
  Restaurant,
  SportsEsports,
  Visibility,
  Favorite,
  Share,
  CheckCircle
} from '@mui/icons-material';

interface HostelCardProps {
  hostel: any;
  onViewDetails: (id: string) => void;
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  isFavorited?: boolean;
}

const HostelCard: React.FC<HostelCardProps> = ({
  hostel,
  onViewDetails,
  onFavorite,
  onShare,
  isFavorited = false
}) => {
  const facilityIcons = {
    wifi: <Wifi />,
    mess: <LocalDining />,
    laundry: <CheckCircle />,
    security: <Security />,
    parking: <DirectionsCar />,
    gym: <FitnessCenter />,
    library: <LocalLibrary />,
    medical: <LocalHospital />,
    cafeteria: <Restaurant />,
    recreation: <SportsEsports />
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'full': return 'error';
      case 'maintenance': return 'warning';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'boys': return '#1976d2';
      case 'girls': return '#d81b60';
      case 'co-ed': return '#7b1fa2';
      default: return '#666';
    }
  };

  const availableFacilities = Object.entries(hostel.facilities)
    .filter(([_, available]) => available)
    .slice(0, 4);

  return (
    <Card
      sx={{
        maxWidth: 400,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: (theme) => theme.shadows[12],
        },
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {/* Header Image with Overlay */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="div"
          sx={{
            height: 220,
            background: `linear-gradient(135deg, ${getTypeColor(hostel.type)}22, ${getTypeColor(hostel.type)}44)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: getTypeColor(hostel.type),
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            {hostel.name.charAt(0).toUpperCase()}
          </Avatar>
          
          {/* Status Badge */}
          <Chip
            label={hostel.status.toUpperCase()}
            color={getStatusColor(hostel.status) as any}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontWeight: 'bold',
              fontSize: '0.7rem'
            }}
          />

          {/* Type Badge */}
          <Chip
            label={hostel.type.toUpperCase()}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: getTypeColor(hostel.type),
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.7rem'
            }}
          />

          {/* Action Buttons */}
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Stack direction="row" spacing={1}>
              {onFavorite && (
                <IconButton
                  size="small"
                  onClick={() => onFavorite(hostel._id)}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    color: isFavorited ? 'error.main' : 'text.secondary',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
                  }}
                >
                  <Favorite fontSize="small" />
                </IconButton>
              )}
              {onShare && (
                <IconButton
                  size="small"
                  onClick={() => onShare(hostel._id)}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
                  }}
                >
                  <Share fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Box>
        </CardMedia>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Title and Rating */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 'bold',
              mb: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {hostel.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Rating
              value={hostel.rating.average}
              precision={0.5}
              size="small"
              readOnly
            />
            <Typography variant="body2" color="text.secondary">
              ({hostel.rating.count} reviews)
            </Typography>
          </Box>
        </Box>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOn color="action" sx={{ fontSize: 18, mr: 0.5 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {hostel.address.city}, {hostel.address.state}
          </Typography>
        </Box>

        {/* Occupancy Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Occupancy
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {hostel.currentOccupancy}/{hostel.capacity}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={hostel.occupancyPercentage}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: hostel.occupancyPercentage > 90 ? 'error.main' : 
                        hostel.occupancyPercentage > 70 ? 'warning.main' : 'success.main'
              }
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {hostel.availableCapacity} beds available
          </Typography>
        </Box>

        {/* Facilities */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Facilities
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {availableFacilities.map(([facility, _]) => (
              <Tooltip key={facility} title={facility.charAt(0).toUpperCase() + facility.slice(1)}>
                <Chip
                  icon={facilityIcons[facility as keyof typeof facilityIcons]}
                  label=""
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 'auto', '& .MuiChip-label': { display: 'none' } }}
                />
              </Tooltip>
            ))}
            {Object.keys(hostel.facilities).length > 4 && (
              <Chip
                label={`+${Object.keys(hostel.facilities).length - 4}`}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Fees */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" color="primary" fontWeight="bold">
              ₹{hostel.fees.monthly.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              per month
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              Security: ₹{hostel.fees.security.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admission: ₹{hostel.fees.admission.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => onViewDetails(hostel._id)}
          startIcon={<Visibility />}
          sx={{
            py: 1,
            fontWeight: 'bold',
            borderRadius: 2,
            background: `linear-gradient(45deg, ${getTypeColor(hostel.type)}, ${getTypeColor(hostel.type)}AA)`
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default HostelCard;
