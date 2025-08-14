import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, } from '@mui/material';
import { Home, Dashboard, List } from '@mui/icons-material';
import HostelComponent from './HostelComponent';
import HostelDashboard from '../dashboard/HostelDashboard';

type DemoView = 'dashboard' | 'hostels';

const HostelDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<DemoView>('dashboard');

  const handleViewAllHostels = () => {
    setCurrentView('hostels');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation Bar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Home sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hostel Management System
          </Typography>
          <Button
            color="inherit"
            startIcon={<Dashboard />}
            onClick={handleBackToDashboard}
            sx={{ mr: 1 }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            startIcon={<List />}
            onClick={handleViewAllHostels}
          >
            Hostels
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default' }}>
        {currentView === 'dashboard' ? (
          <HostelDashboard
          />
        ) : (
          <HostelComponent />
        )}
      </Box>
    </Box>
  );
};

export default HostelDemo;
