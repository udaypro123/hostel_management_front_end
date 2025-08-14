import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  MeetingRoom as RoomIcon,
  Announcement as AnnouncementIcon,
  AccountCircle,
  Logout,
  Settings,
  PushPin,
  PushPinOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from '../theme/ThemeSelector';

const drawerWidth = 240;
const miniDrawerWidth = 60;

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentModule: string;
  onModuleChange: (module: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  currentModule, 
  onModuleChange 
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [isDrawerPinned, setIsDrawerPinned] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mock user data - replace with actual user data from your backend
  const user = JSON.parse(localStorage.getItem('authUser') || '{}');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear any stored auth tokens/data here if needed
    localStorage.removeItem('authToken'); // Example - adjust based on your auth implementation
    navigate('/login');
    handleMenuClose();
  };

  const handleDrawerMouseEnter = () => {
    if (!isMobile && !isDrawerPinned) {
      setIsDrawerExpanded(true);
    }
  };

  const handleDrawerMouseLeave = () => {
    if (!isMobile && !isDrawerPinned) {
      setIsDrawerExpanded(false);
    }
  };

  const handleTogglePin = () => {
    setIsDrawerPinned(!isDrawerPinned);
    if (!isDrawerPinned) {
      setIsDrawerExpanded(true);
    }
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      module: 'dashboard',
      roles: ['admin', 'warden', 'student']
    },
    { 
      text: 'Add Hostel', 
      icon: <HomeIcon />, 
      module: 'add-hostel',
      roles: ['admin']
    },
    { 
      text: 'All Wardens', 
      icon: <PersonIcon />, 
      module: 'all-wardens',
      roles: ['admin']
    },
    { 
      text: 'Add Room', 
      icon: <RoomIcon />, 
      module: 'add-room',
      roles: ['admin', 'warden']
    },
    { 
      text: 'Announcements', 
      icon: <AnnouncementIcon />, 
      module: 'announcements',
      roles: ['admin', 'warden', 'student']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'student')
  );

  const drawer = (
    <div>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 1, color: 'primary.main', height: 40, width: 40 }} />
            {(isDrawerExpanded || isDrawerPinned || isMobile) && (
              <Typography variant="h5" noWrap component="div" fontWeight="bold">
                Hostel 
              </Typography>
            )}
          </Box>
          {!isMobile && (isDrawerExpanded || isDrawerPinned) && (
            <IconButton 
              size="small" 
              onClick={handleTogglePin}
              sx={{ 
                color: isDrawerPinned ? 'primary.main' : 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {isDrawerPinned ? <PushPin /> : <PushPinOutlined />}
            </IconButton>
          )}
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={currentModule === item.module}
              onClick={() => {
                onModuleChange(item.module);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                minHeight: 48,
                justifyContent: (isDrawerExpanded || isDrawerPinned || isMobile) ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: (isDrawerExpanded || isDrawerPinned || isMobile) ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {(isDrawerExpanded || isDrawerPinned || isMobile) && (
                <ListItemText primary={item.text} />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const actualDrawerWidth = (isDrawerExpanded || isDrawerPinned) ? drawerWidth : miniDrawerWidth;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { xs: '100%', md: `calc(100% - ${isMobile ? 0 : actualDrawerWidth}px)` },
          ml: { xs: 0, md: `${isMobile ? 0 : actualDrawerWidth}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* {menuItems.find(item => item.module === currentModule)?.text || 'Dashboard'} */}
            Hostel Management
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block', fontWeight:'600', fontSize:"1.2rem" } }}>
              Welcome, {user?.fullName.charAt(0).toUpperCase() + user?.fullName.slice(1)}
            </Typography>
            <ThemeSelector />
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', border: '2px solid white' }}>
                {user?.fullName?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ 
          width: { xs: 0, md: actualDrawerWidth }, 
          flexShrink: { md: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
        aria-label="navigation"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          onMouseEnter={handleDrawerMouseEnter}
          onMouseLeave={handleDrawerMouseLeave}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: actualDrawerWidth,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: '100%', md: `calc(100% - ${actualDrawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'grey.50',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
