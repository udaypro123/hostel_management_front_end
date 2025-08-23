import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export type ThemeMode = 'light' | 'dark';

interface CustomColors {
  primary: string;
  secondary: string;
  background: string;
}

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  setCustomColors: (colors: CustomColors) => void;
  theme: Theme;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themeConfigs = {
  light: {
    palette: {
      mode: 'light' as const,
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
        light: '#f06292',
        dark: '#c51162',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
      text: {
        primary: '#212121',
        secondary: '#757575',
      },
    },
  },
  dark: {
    palette: {
      mode: 'dark' as const,
      primary: {
        main: '#90caf9',
        light: '#e3f2fd',
        dark: '#42a5f5',
      },
      secondary: {
        main: '#f48fb1',
        light: '#fce4ec',
        dark: '#f06292',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      text: {
        primary: '#ffffff',
        secondary: '#b0b0b0',
      },
    },
  },
  blue: {
    palette: {
      mode: 'light' as const,
      primary: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
      },
      secondary: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
      },
      background: {
        default: '#e3f2fd',
        paper: '#ffffff',
      },
      text: {
        primary: '#0d47a1',
        secondary: '#1565c0',
      },
    },
  },
  green: {
    palette: {
      mode: 'light' as const,
      primary: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
      },
      secondary: {
        main: '#ff5722',
        light: '#ff8a65',
        dark: '#d84315',
      },
      background: {
        default: '#e8f5e8',
        paper: '#ffffff',
      },
      text: {
        primary: '#1b5e20',
        secondary: '#2e7d32',
      },
    },
  },
  purple: {
    palette: {
      mode: 'light' as const,
      primary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
      secondary: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
      },
      background: {
        default: '#f3e5f5',
        paper: '#ffffff',
      },
      text: {
        primary: '#4a148c',
        secondary: '#6a1b9a',
      },
    },
  },
  orange: {
    palette: {
      mode: 'light' as const,
      primary: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
      },
      secondary: {
        main: '#3f51b5',
        light: '#7986cb',
        dark: '#303f9f',
      },
      background: {
        default: '#fff3e0',
        paper: '#ffffff',
      },
      text: {
        primary: '#e65100',
        secondary: '#f57c00',
      },
    },
  },
};

interface CustomThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return (savedTheme as ThemeMode) || 'light';
  });

  const [customColors, setCustomColors] = useState<CustomColors>(() => {
    const savedColors = localStorage.getItem('themeColors');
    return savedColors ? JSON.parse(savedColors) : {
      primary: '#1976d2',
      secondary: '#dc004e',
      background: '#f5f5f5'
    };
  });

  useEffect(() => {
    localStorage.setItem('themeColors', JSON.stringify(customColors));
  }, [customColors]);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: customColors.primary,
        light: customColors.primary + '99',
        dark: customColors.primary + 'dd',
      },
      secondary: {
        main: customColors.secondary,
        light: customColors.secondary + '99',
        dark: customColors.secondary + 'dd',
      },
      background: {
        default: themeMode === 'light' ? customColors.background : '#121212',
        paper: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            padding: '8px 16px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, setCustomColors, theme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
