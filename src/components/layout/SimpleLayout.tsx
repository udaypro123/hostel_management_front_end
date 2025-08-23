import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Avatar,
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
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  keyframes
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  MeetingRoom as RoomIcon,
  Logout,
  Settings,
  SupervisorAccount,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import SnowshoeingIcon from '@mui/icons-material/Snowshoeing';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import PaymentIcon from '@mui/icons-material/Payment';
import CampaignIcon from '@mui/icons-material/Campaign';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Chatbot from '../../chatBot/chatBot';

const drawerWidth = 240;
const borderPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0px rgba(238, 5, 255, 1);
  }
  20% {
    box-shadow: 0 0 0 3px rgba(236, 55, 252, 1);
  }
  30% {
    box-shadow: 0 0 0 6px rgba(244, 107, 254, 1);
  }
  45% {
    box-shadow: 0 0 0 8px rgba(238, 125, 255, 1);
  }
  55% {
    box-shadow: 0 0 0 10px rgba(254, 156, 247, 1);
  }
  65% {
    box-shadow: 0 0 0 14px rgba(245, 172, 255, 1);
  }
  85% {
    box-shadow: 0 0 0 18px rgba(243, 217, 252, 1);
  }
  100% {
    box-shadow: 0 0 0 0px rgba(254, 244, 255, 1);
  }
`;


interface SimpleLayoutProps {
  children: React.ReactNode;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Get user data from localStorage
  let data = localStorage.getItem('user') || '{}';
  const user = JSON.parse(data);
  console.log('User data:', user);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    navigate('/login');
    handleProfileMenuClose();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', role: ["admin", 'student', 'warden'] },
    { text: 'Payment', icon: <PaymentIcon />, path: '/payment', role: ["admin", 'student', 'warden'] },
    { text: 'Students', icon: <SnowshoeingIcon />, path: '/students', role: ["admin"] },
    { text: 'Hostels', icon: <HomeIcon />, path: '/hostels', role: ["admin"] },
    { text: 'Wardens', icon: <SupervisorAccount />, path: '/wardens', role: ["admin"] },
    { text: 'Rooms', icon: <RoomIcon />, path: '/rooms', role: ["admin"] },
    { text: 'Degrees', icon: <AccountBalanceIcon />, path: '/degrees', role: ["admin"] },
    { text: 'Announcements', icon: <CampaignIcon />, path: '/announcements', role: ["admin", "warden"] },
    { text: 'Request', icon: <HelpCenterIcon />, path: '/request', role: ["admin",'student', 'warden'] },
    // { text: 'AI ChatBot', icon: <PsychologyIcon />, path: '/chatbot', role: ['admin', 'student', 'warden'] },
  ]?.filter((item: any) => item.role?.includes(user.role));

  console.log("menuItems", menuItems)

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleChatbot = async () => {
    setIsChatbotOpen(true)
  }

  const handleclose = async () => {
    setIsChatbotOpen(false)
  }

  const drawer = (
    <div>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around' }}>
          <Box sx={{ display: 'flex', }}>
            <HomeIcon sx={{ color: 'primary.main', mr: 2 }} />
            <Typography variant="h6" noWrap component="div" color="primary.main" fontWeight="bold">
              Hostel Manager
            </Typography>
          </Box>
          <IconButton onClick={toggleDrawer} size={"large"}>
            {isDrawerOpen ? <ChevronLeft fontSize={"large"} /> : <ChevronRight fontSize={"large"} />}
          </IconButton>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleMenuClick(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon sx={{
                color: location.pathname === item.path ? 'inherit' : 'text.secondary'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />

    </div>
  );

  return (
    <Box sx={{ display: 'flex', }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: isDrawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: isDrawerOpen ? `${drawerWidth}px` : '0px' },
          transition: 'width 0.3s ease, margin-left 0.3s ease',
          borderRadius: 0
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { md: isDrawerOpen ? 'none' : 'block', xs: 'block' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1 }}>
            Hostel Management System
          </Typography>

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            {/* <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1, gap: 1 }}>
              {user?.fullName}
            </Typography> */}
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', border: '2px solid white' }}>
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        id="primary-search-account-menu"
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
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            width: 250,
            minHeight: 300,
          },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose} sx={{ fontWeight: "bold" }}>
          {/* <AccountCircle sx={{ mr: 1 }} /> */}
          {user?.fullName || 'Profile'}
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose} sx={{ marginTop: 2 }} >
          <AccountCircleIcon sx={{ mr: 1 }} />
          View Profile
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose} sx={{ marginTop: 1 }}>
          <Brightness4Icon sx={{ mr: 1 }} />
          DarkMode
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose} sx={{ marginTop: 1 }}>
          <Settings sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>


      <Box
        component="nav"
        sx={{
          width: { md: isDrawerOpen ? drawerWidth : '0px' },
          flexShrink: { md: 0 },
          transition: 'width 0.3s ease'
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              transition: 'transform 0.3s ease',
              transform: isDrawerOpen ? 'translateX(0)' : `translateX(-${drawerWidth}px)`
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
          width: { md: isDrawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: 'width 0.3s ease',
          borderRadius: 0
        }}
      >
        <Toolbar />
        {children}
      </Box>

      <Box
        onClick={handleChatbot}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 5,
          position: "fixed",
          bottom: 25,
          right: 30,
        }}
      >
        <Box
          sx={{
            fontSize: 40,
            borderRadius: "50%",
            cursor: "pointer",
            animation: `${borderPulse} 1.1s infinite ease-in-out`,
            padding: .5
          }}
        >
          🤖
        </Box>
      </Box>
      {
        isChatbotOpen && <Chatbot open={isChatbotOpen} handleclose={handleclose} />
      }
    </Box>
  );
};

export default SimpleLayout;
