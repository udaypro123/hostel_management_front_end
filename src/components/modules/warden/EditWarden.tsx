import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
// import { useNavigate, useLocation } from 'react-router-dom'; // For React Router

interface EditWardenProps {
  // Keep it simple - manage props yourself
}

const EditWarden: React.FC<EditWardenProps> = () => {
  // Option 1: Get props from localStorage
  const getWardenData = () => {
    const stored = localStorage.getItem('selectedWarden');
    return stored ? JSON.parse(stored) : null;
  };

  // Option 2: Get props from React Router location state (when you setup proper routing)
  // const location = useLocation();
  // const wardenData = location.state?.wardenData;
  
  // const navigate = useNavigate();
  
  const wardenData = getWardenData();

  const handleBack = () => {
    // navigate('/dashboard/all-wardens');
    console.log('Navigate back to all wardens');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back to All Wardens
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Edit Warden {wardenData ? `- ${wardenData.firstName} ${wardenData.lastName}` : ''}
        </Typography>
      </Box>

      {/* Content */}
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Edit Warden Component
        </Typography>
        
        {wardenData ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Editing Warden:</strong> {wardenData.firstName} {wardenData.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Email:</strong> {wardenData.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Phone:</strong> {wardenData.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Experience:</strong> {wardenData.experience} years
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Status:</strong> {wardenData.isActive ? 'Active' : 'Inactive'}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No warden data found. Navigate from the table to edit a specific warden.
          </Typography>
        )}
        
        <Typography variant="body1" color="text.secondary">
          This component will contain the warden edit form. You can reuse the AddWarden form 
          component and populate it with existing warden data for editing.
        </Typography>
      </Paper>
    </Box>
  );
};

export default EditWarden;
