import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  LightMode,
  DarkMode,
  Water,
  Nature,
  ColorLens,
  LocalFireDepartment,
  Check,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';
import type { ThemeMode } from '../../contexts/ThemeContext';

const ThemeSelector: React.FC = () => {
  const { themeMode, setThemeMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    handleClose();
  };

  const themeOptions = [
    { mode: 'light' as ThemeMode, name: 'Light', icon: <LightMode />, color: '#1976d2' },
    { mode: 'dark' as ThemeMode, name: 'Dark', icon: <DarkMode />, color: '#90caf9' },
    { mode: 'blue' as ThemeMode, name: 'Ocean Blue', icon: <Water />, color: '#2196f3' },
    { mode: 'green' as ThemeMode, name: 'Nature Green', icon: <Nature />, color: '#4caf50' },
    { mode: 'purple' as ThemeMode, name: 'Royal Purple', icon: <ColorLens />, color: '#9c27b0' },
    { mode: 'orange' as ThemeMode, name: 'Sunset Orange', icon: <LocalFireDepartment />, color: '#ff9800' },
  ];

  return (
    <>
      <Tooltip title="Change Theme">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ 
            color: 'inherit',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          <PaletteIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 200,
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Choose Theme
          </Typography>
        </Box>
        <Divider />
        {themeOptions.map((option) => (
          <MenuItem
            key={option.mode}
            onClick={() => handleThemeChange(option.mode)}
            selected={themeMode === option.mode}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: option.color }}>
              {option.icon}
            </ListItemIcon>
            <ListItemText primary={option.name} />
            {themeMode === option.mode && (
              <Check sx={{ color: 'primary.main', ml: 1 }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ThemeSelector;
