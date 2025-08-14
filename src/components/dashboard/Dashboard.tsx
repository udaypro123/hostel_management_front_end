import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  MeetingRoom as RoomIcon,
  Announcement as AnnouncementIcon,
  TrendingUp,
  People,
  CheckCircle,
  Warning
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Hostels',
      value: '12',
      icon: <HomeIcon />,
      color: '#1976d2',
      change: '+2 this month'
    },
    {
      title: 'Total Students',
      value: '1,247',
      icon: <PersonIcon />,
      color: '#2e7d32',
      change: '+45 this month'
    },
    {
      title: 'Available Rooms',
      value: '89',
      icon: <RoomIcon />,
      color: '#f57c00',
      change: '-12 this month'
    },
    {
      title: 'Active Announcements',
      value: '8',
      icon: <AnnouncementIcon />,
      color: '#7b1fa2',
      change: '+3 this week'
    }
  ];

  const recentAnnouncements = [
    {
      title: 'Mess Timing Update',
      date: '2024-07-15',
      status: 'Active',
      priority: 'High'
    },
    {
      title: 'WiFi Maintenance Notice',
      date: '2024-07-14',
      status: 'Active',
      priority: 'Medium'
    },
    {
      title: 'Fee Payment Reminder',
      date: '2024-07-13',
      status: 'Active',
      priority: 'High'
    },
    {
      title: 'Room Inspection Schedule',
      date: '2024-07-12',
      status: 'Expired',
      priority: 'Low'
    }
  ];

  const occupancyData = [
    { hostel: 'Block A', occupied: 85, total: 100 },
    { hostel: 'Block B', occupied: 92, total: 100 },
    { hostel: 'Block C', occupied: 78, total: 100 },
    { hostel: 'Block D', occupied: 95, total: 100 },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard Overview
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid key={index}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.change}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      backgroundColor: stat.color,
                      width: 56,
                      height: 56
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Hostel Occupancy */}
        <Grid >
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Hostel Occupancy
            </Typography>
            <Box sx={{ mt: 2 }}>
              {occupancyData.map((hostel, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {hostel.hostel}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {hostel.occupied}/{hostel.total}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(hostel.occupied / hostel.total) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        backgroundColor: hostel.occupied / hostel.total > 0.9 ? '#f44336' : 
                                       hostel.occupied / hostel.total > 0.8 ? '#ff9800' : '#4caf50'
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Announcements */}
        <Grid >
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Recent Announcements
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentAnnouncements.map((announcement, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {announcement.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {announcement.date}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={announcement.status}
                          size="small"
                          color={announcement.status === 'Active' ? 'success' : 'default'}
                          icon={announcement.status === 'Active' ? <CheckCircle /> : <Warning />}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={announcement.priority}
                          size="small"
                          color={
                            announcement.priority === 'High' ? 'error' :
                            announcement.priority === 'Medium' ? 'warning' : 'default'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid >
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Actions
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                { title: 'Add New Student', icon: <People />, color: '#1976d2' },
                { title: 'Create Announcement', icon: <AnnouncementIcon />, color: '#7b1fa2' },
                { title: 'Room Management', icon: <RoomIcon />, color: '#f57c00' },
                { title: 'Generate Report', icon: <TrendingUp />, color: '#2e7d32' }
              ].map((action, index) => (
                <Grid  key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: action.color,
                          width: 48,
                          height: 48,
                          mx: 'auto',
                          mb: 1
                        }}
                      >
                        {action.icon}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {action.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
