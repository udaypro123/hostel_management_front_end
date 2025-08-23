import React from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Chip,
  Divider,
  useTheme,
  Button
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const formatDate = (d?: string) => {
  if (!d) return 'N/A';
  try {
    return new Date(d).toLocaleString();
  } catch (e) {
    return d;
  }
};

const UserProfile: React.FC = () => {
  const theme = useTheme();

  const data = localStorage.getItem('user') || '{}';
  const user: any = JSON.parse(data);

  const name = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
  const initial = name ? name.charAt(0).toUpperCase() : 'U';
  const avatarSrc = user?.profilePicture || '';

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start' }}>
          <Box sx={{ flex: '0 0 32%', textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Avatar
                src={avatarSrc || undefined}
                alt={name}
                sx={{
                  width: { xs: 96, md: 140 },
                  height: { xs: 96, md: 140 },
                  bgcolor: avatarSrc ? 'transparent' : theme.palette.primary.main,
                  fontSize: { xs: 36, md: 56 },
                  border: `4px solid ${theme.palette.background.paper}`,
                }}
              >
                {!avatarSrc && initial}
              </Avatar>

              <Box sx={{ mt: 2 }}>
                <Typography variant="h5" fontWeight={700}>
                  {name}
                </Typography>
                <Chip
                  label={(user?.role || 'user').toString().toUpperCase()}
                  sx={{ mt: 1, backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
                />
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Button variant="contained" startIcon={<EditOutlinedIcon />} sx={{ background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})` }}>
                  Edit Profile
                </Button>
              </Box>
            </Box>
          </Box>

          <Box sx={{ flex: '1 1 68%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Personal Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since {formatDate(user?.createdAt)}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <EmailOutlinedIcon color="action" />
                  <Box>
                    <Typography variant="subtitle2">Email</Typography>
                    <Typography variant="body2">{user?.email || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <PhoneOutlinedIcon color="action" />
                  <Box>
                    <Typography variant="subtitle2">Phone</Typography>
                    <Typography variant="body2">{user?.phoneNumber || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <LocationOnOutlinedIcon color="action" />
                  <Box>
                    <Typography variant="subtitle2">Location</Typography>
                    <Typography variant="body2">{user?.address?.country || user?.address || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <CalendarTodayOutlinedIcon color="action" />
                  <Box>
                    <Typography variant="subtitle2">Date of Birth</Typography>
                    <Typography variant="body2">{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <AccessTimeOutlinedIcon color="action" />
                  <Box>
                    <Typography variant="subtitle2">Last Login</Typography>
                    <Typography variant="body2">{formatDate(user?.lastLogin)}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography variant="subtitle2">Verified</Typography>
                  <Typography variant="body2">{user?.isEmailVerified ? 'Yes' : 'No'}</Typography>
                </Box>
              </Box>

              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>About</Typography>
                <Paper sx={{ p: 2, background: theme.palette.background.paper }}>
                  <Typography variant="body2" color="text.secondary">
                    {user?.about || 'No description provided.'}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfile;
