import React from 'react';
import { Box, Paper, Tooltip, useTheme } from '@mui/material';
import type { ThemeMode } from '../../contexts/ThemeContext';

interface ColorOption {
  name: string;
  primary: string;
  secondary: string;
  background: string;
}

const colorOptions: ColorOption[] = [
  { name: 'Blue', primary: '#1976d2', secondary: '#dc004e', background: '#f5f5f5' },
  { name: 'Purple', primary: '#9c27b0', secondary: '#f50057', background: '#f3e5f5' },
  { name: 'Green', primary: '#2e7d32', secondary: '#f50057', background: '#e8f5e9' },
  { name: 'Red', primary: '#d32f2f', secondary: '#7b1fa2', background: '#ffebee' },
  { name: 'Orange', primary: '#ed6c02', secondary: '#2e7d32', background: '#fff3e0' },
  { name: 'Pink', primary: '#e91e63', secondary: '#2196f3', background: '#fce4ec' },
  { name: 'Teal', primary: '#009688', secondary: '#ff4081', background: '#e0f2f1' },
  { name: 'Indigo', primary: '#3f51b5', secondary: '#f50057', background: '#e8eaf6' },
  { name: 'Brown', primary: '#795548', secondary: '#00bcd4', background: '#efebe9' },
  { name: 'Deep Purple', primary: '#673ab7', secondary: '#00bcd4', background: '#ede7f6' },
  { name: 'Deep Orange', primary: '#ff5722', secondary: '#2196f3', background: '#fbe9e7' },
  { name: 'Cyan', primary: '#00bcd4', secondary: '#f50057', background: '#e0f7fa' },
  { name: 'Light Blue', primary: '#03a9f4', secondary: '#ff4081', background: '#e1f5fe' },
  { name: 'Light Green', primary: '#8bc34a', secondary: '#ff4081', background: '#f1f8e9' },
  { name: 'Lime', primary: '#cddc39', secondary: '#f50057', background: '#f9fbe7' },
  { name: 'Yellow', primary: '#ffeb3b', secondary: '#f50057', background: '#fffde7' },
  { name: 'Amber', primary: '#ffc107', secondary: '#2196f3', background: '#fff8e1' },
  { name: 'Blue Grey', primary: '#607d8b', secondary: '#ff4081', background: '#eceff1' },
  { name: 'Deep Brown', primary: '#5d4037', secondary: '#00bcd4', background: '#d7ccc8' },

];

interface ColorPickerProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode, colors: ColorOption) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ currentTheme, onThemeChange }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 2, maxHeight: '400px', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {colorOptions.map((color) => (
          <Box key={color.name} sx={{ width: '30%' }}>
            <Tooltip title={color.name} arrow>
              <Paper
                onClick={() => onThemeChange(currentTheme, color)}
                sx={{
                  width: '100%',
                  height: 40,
                  cursor: 'pointer',
                  background: `linear-gradient(45deg, ${color.primary} 50%, ${color.secondary} 50%)`,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: theme.shadows[4],
                  },
                  border: theme.palette.primary.main === color.primary ? `2px solid ${theme.palette.primary.main}` : 'none',
                }}
              />
            </Tooltip>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export { ColorPicker, type ColorOption, colorOptions };
