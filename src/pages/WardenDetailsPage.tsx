import { useLocation } from 'react-router-dom';
import { Box, Paper, Typography, Button, Avatar, Chip } from '@mui/material';
import { ArrowBack, Email, Phone, LocationOn, School, Emergency } from '@mui/icons-material';

export default function WardenDetailsPage() {
  // const navigate = useNavigate();
  const location = useLocation();
  let wardenData = location.state?.wardenData || {};
  const onNavigateBack = () => {
    window.history.back();
  };
  console.log('Warden ID:', wardenData);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={onNavigateBack}
          sx={{ mr: 2, fontWeight: 'bold', color: 'primary.main', fontSize: '1.3rem' }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', textAlign: 'center', flexGrow: 1  , mr: 8}}>
          Warden Details
        </Typography>
      </Box>

      {/* Data Source Indicator */}
      {wardenData ? (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#e8f5e8', borderRadius: 2 }}>
          <Typography variant="body2" color="success.main">
            ✓ Displaying data for specific warden: {wardenData.firstName} {wardenData.lastName}
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#fff3cd', borderRadius: 2 }}>
          <Typography variant="body2" color="warning.main">
            ⚠ No specific warden data provided. Showing sample data.
          </Typography>
        </Paper>
      )}

      {/* Profile Section */}
      <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mr: 3,
              bgcolor: 'primary.main',
              fontSize: '2rem'
            }}
          >
            {wardenData.firstName[0]}{wardenData.lastName[0]}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {wardenData.firstName} {wardenData.lastName}
            </Typography>
            <Chip
              label={wardenData.isActive ? 'Active' : 'Inactive'}
              color={wardenData.isActive ? 'success' : 'error'}
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              Hostel Warden
            </Typography>
          </Box>
        </Box>

        {/* Contact Information */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Contact Information
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
            <Email sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Email</Typography>
              <Typography variant="body1">{wardenData.email}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '250px' }}>
            <Phone sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Phone</Typography>
              <Typography variant="body1">{wardenData.phone}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
            <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Address</Typography>
              <Typography variant="body1">{wardenData.address}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '250px' }}>
            <Emergency sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Emergency Contact</Typography>
              <Typography variant="body1">{wardenData.emergencyContact}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Professional Information */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Professional Information
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}>
            <School sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Qualification</Typography>
              <Typography variant="body1">{wardenData.qualification}</Typography>
            </Box>
          </Box>

          <Box sx={{ minWidth: '150px' }}>
            <Typography variant="body2" color="text.secondary">Experience</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {wardenData.experience} years
            </Typography>
          </Box>

          <Box sx={{ minWidth: '200px' }}>
            <Typography variant="body2" color="text.secondary">Joining Date</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {new Date(wardenData.joiningDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
