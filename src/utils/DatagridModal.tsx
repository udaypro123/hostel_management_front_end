import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DatagridModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  content: string;
}

const DatagridModal: React.FC<DatagridModalProps> = ({ open, onClose, title, content }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          minWidth: { xs: '80vw', sm: 400 },
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{title || 'Details'}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
          {content}
        </Typography>
      </Box>
    </Modal>
  );
};

export default DatagridModal;
