import { ArrowBack, } from '@mui/icons-material';
import { Avatar, Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useLocation } from 'react-router-dom';
import TabIcon from '@mui/icons-material/Tab';
import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

export default function PaymentDetailsPage() {

  const location = useLocation();
  let paymentData = location?.state || {};
  const onNavigateBack = () => {
    window.history.back();
  };
  console.log('Hostel ID:', paymentData);

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
          Payment Details
        </Typography>
      </Box>

      {/* Data Source Indicator */}
      {paymentData ? (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#e8f5e8', borderRadius: 2 }}>
          <Typography variant="body2" color="success.main">
            ✓ Displaying data for specific Student: {paymentData?.name}
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
            {/* {paymentData.name[0]}{paymentData.location[0]} */}
          </Avatar>
          <Box>
            <Typography variant="h4" color="text.secondary">
              {paymentData?.name || 'Student Name'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
            <TabIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Date Of Birth</Typography>
              <Typography variant="body1">{paymentData?.dob}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
            <SensorOccupiedIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Email</Typography>
              <Typography variant="body1">{paymentData?.email}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
            <DriveFileRenameOutlineIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Phone </Typography>
              <Typography variant="body1">{paymentData?.phone}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
            <MonetizationOnIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Amount Paid</Typography>
              <Typography variant="body1">{paymentData?.amount}</Typography>
            </Box>
          </Box>
          {/* <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
            <MonetizationOnIcon sx={{ mr: 5, color: 'primary.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Amount</Typography>
              <Typography variant="body1">{paymentData?.amount}</Typography>
            </Box>
          </Box> */}
        </Box>
      </Paper>
    </Box>
  )
}
