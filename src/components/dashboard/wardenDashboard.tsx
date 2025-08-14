import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  useTheme,
  Fade
} from '@mui/material';
import {
  Home,
} from '@mui/icons-material';
import { getHostels } from '../auth/api/hostelApi';
import { useNavigate } from 'react-router-dom';
import { HostelLoader } from '../../utils/hostelLoader';
import { StatCard } from '../../utils/StatCard';
import { getStudents } from '../auth/api/studentApi';
import { getWardenById } from '../auth/api/wardenApi';
import GroupIcon from '@mui/icons-material/Group';
import AddHomeIcon from '@mui/icons-material/AddHome';
import Man3Icon from '@mui/icons-material/Man3';

interface HostelDashboardProps {
  onViewAllHostels?: () => void;
  onAddHostel?: () => void;
  onViewHostelDetails?: (id: string) => void;
}

const WardenDashboard: React.FC<HostelDashboardProps> = ({ }) => {
  const theme = useTheme();
  const navigate = useNavigate()
  const [wardendata, setWardendata] = useState<any>();
  const [studentCount, setStudentCount] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [hostels, setHostels] = useState<any[]>([]);
  let data = localStorage.getItem('user') || '{}';
  const user = JSON.parse(data);
  console.log('User data:', user, hostels[0]);


  const fetchHostels = async () => {
    try {
      setLoading(true);
      const response = await getHostels();
      const responseStudent = await getStudents();

      const wardenresponse = await getWardenById(user?.id);
      console.log('Fetched hostels:', response.data);
      console.log('wardenresponse', wardenresponse.data);
      const studentCount = responseStudent?.data?.filter((stu: any) => stu?.hostelId?._id === wardenresponse?.data?._id)
      setStudentCount(studentCount?.length)
      setWardendata(wardenresponse.data);
      setHostels(response.data);
    } catch (error) {
      console.error('Error fetching hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);




  if (loading) {
    return <HostelLoader />
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Welcome Back ! {user.fullName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Overview of your hostel operations and key metrics
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Fade in timeout={300}>
          <Box sx={{ flex: '1 1 250px', minWidth: 250, cursor: "pointer" }} onClick={() => navigate("/hostels")} >
            <StatCard
              title="Hostel Name"
              value={wardendata?.hostelName || ""}
              icon={<Home />}
              color={theme.palette.primary.main}
            />
          </Box>
        </Fade>

        <Fade in timeout={500}>
          <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
            <StatCard
              title="Hostel Type"
              value={wardendata?.type || ""}
              icon={<Man3Icon />}
              color={theme.palette.primary.light}
            />
          </Box>
        </Fade>
        <Fade in timeout={500}>
          <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
            <StatCard
              title="Total Rooms"
              value={wardendata?.rooms?.length || 0}
              icon={<AddHomeIcon />}
              color={theme.palette.success.light}
            />
          </Box>
        </Fade>
        <Fade in timeout={500}>
          <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
            <StatCard
              title="Total Student"
              value={studentCount || 0}
              icon={<GroupIcon />}
              color={theme.palette.warning.dark}
            />
          </Box>
        </Fade>
      </Box>

    </Container>
  );
};

export default WardenDashboard;
