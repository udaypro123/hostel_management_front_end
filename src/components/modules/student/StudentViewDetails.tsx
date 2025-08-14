import { ArrowBack, LocationOn, } from '@mui/icons-material';
import { Avatar, Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useLocation } from 'react-router-dom';
import TabIcon from '@mui/icons-material/Tab';
import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import HeightIcon from '@mui/icons-material/Height';

export default function StuentDetailsPage() {

  const location = useLocation();
  let studentData = location?.state?.studentData || {};
  const onNavigateBack = () => {
    window.history.back();
  };
  console.log('Hostel ID:', studentData);

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
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', textAlign: 'center', flexGrow: 1, mr: 8 }}>
          Student Details
        </Typography>
      </Box>

      {/* Data Source Indicator */}
      {studentData ? (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#e8f5e8', borderRadius: 2 }}>
          <Typography variant="body2" color="success.main">
            ✓ Displaying data for specific Student: {studentData?.name}
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#fff3cd', borderRadius: 2 }}>
          <Typography variant="body2" color="warning.main">
            ⚠ No specific Student data provided. Showing sample data.
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
            {/* {studentData.name[0]}{studentData.location[0]} */}
          </Avatar>
          <Box>
            <Typography variant="h4" color="text.secondary">
              {studentData?.name || 'Student Name'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
            <TabIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Date Of Birth</Typography>
              <Typography variant="body1">{studentData?.dob}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
            <SensorOccupiedIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Email</Typography>
              <Typography variant="body1">{studentData?.email}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '250px' }}>
            <DriveFileRenameOutlineIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Phone </Typography>
              <Typography variant="body1">{studentData?.phone}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '250px' }}>
            <HeightIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Degree</Typography>
              <Typography variant="body1">{studentData?.enrolldegree}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
            <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Address</Typography>
              <Typography variant="body1">{studentData?.address}</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
