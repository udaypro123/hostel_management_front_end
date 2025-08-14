import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import HostelList from './HostelList';
import AddHostel from './hostel/AddHostel';

type ViewMode = 'list' | 'add' | 'edit';

interface HostelComponentState {
  mode: ViewMode;
  selectedHostelId?: string;
}

const HostelComponent: React.FC = () => {
  const [state, setState] = useState<HostelComponentState>({
    mode: 'list'
  });

  const handleViewDetails = (hostelId: string) => {
    setState({
      mode: 'details',
      selectedHostelId: hostelId
    });
  };

  const handleAddHostel = () => {
    setState({
      mode: 'add'
    });
  };

  const handleEditHostel = (hostelId: string) => {
    setState({
      mode: 'edit',
      selectedHostelId: hostelId
    });
  };

  const handleDeleteHostel = (hostelId: string) => {
    // Handle delete logic here
    console.log('Delete hostel:', hostelId);
    // You can add a confirmation dialog and actual delete API call
  };

  const handleBackToList = () => {
    setState({
      mode: 'list'
    });
  };

  const renderCurrentView = () => {
    switch (state.mode) {
      case 'list':
        return (
          <HostelList
            onAddHostel={handleAddHostel}
            onViewDetails={handleViewDetails}
            showAddButton={true}
            title="Hostel Management"
          />
        );
      case 'add':
        return (
          <Container maxWidth="md" sx={{ py: 4 }}>
            <AddHostel />
          </Container>
        );

      case 'edit':
        return state.selectedHostelId ? (
          <Container maxWidth="md" sx={{ py: 4 }}>
            {/* You can create an EditHostel component or modify AddHostel to handle editing */}
            <AddHostel />
          </Container>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {renderCurrentView()}
    </Box>
  );
};

export default HostelComponent;
