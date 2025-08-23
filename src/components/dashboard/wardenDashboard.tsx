import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  useTheme,
  Fade,
  Avatar,
  Paper,
  Button
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
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { deleteAnnouncement, getAnnouncement } from '../auth/api/announcementApi';
import { DataGrid } from '../../utils/Datagrid';
import { enqueueSnackbar } from 'notistack';
import { getRequests } from '../auth/api/requests.Api';
import {
  Add,
} from '@mui/icons-material';
import { DeleteModel } from '../../utils/DeleteModal';

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

  const [announcement, setAnnouncement] = useState<any[]>([]);
  const [requestdata, setRequestdata] = useState<any>([]);
  const [openDeleteModel, setOpenDeleteModel] = useState<boolean>(false);
  const [deleteAnnouncementID, setDeleteAnnouncementID] = useState<string>("");

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

  const fetchRequest = async () => {
    try {
      setLoading(true)
      const requestdata = await getRequests()
      console.log("requestdata", requestdata)
      let obj: any = [];
      requestdata?.data?.map((item: any, index: number) => {
        let newobj = {
          id: index + 1,
          title: item?.title,
          description: item?.description,
          hostelName: item?.hostel?.hostelName,
          document: item?.document,
          solution: item?.solution || 'N/A',
          status: item?.status || 'pending',
          _id: item?._id,
          hostelId: item?.hostel?._id,
        }
        console.log("newobj", newobj)
        obj.push(newobj)
      })
      console.log("newobjnewobj", obj)
      setRequestdata(obj)
      setLoading(false)
    } catch (error) {
      enqueueSnackbar("Error while fetching Request", { variant: "error" })
      setLoading(false)
    }
  }


  const fetchAnnouncement = async () => {
    try {
      setLoading(true)
      const announcedata = await getAnnouncement();
      console.log("announcedata", announcedata)
      let obj: any = [];
      announcedata?.data?.map((item: any, index: number) => {
        let newobj = {
          id: index + 1,
          title: item?.title,
          description: item?.description,
          hostelName: item?.hostel?.hostelName,
          document: item?.document,
          _id: item?._id,
          hostelId: item?.hostel?._id,
        }
        console.log("newobj", newobj)
        obj.push(newobj)
      })
      console.log("newobjnewobj", obj)
      setAnnouncement(obj)
      // enqueueSnackbar("fetched Announcement successfully ", { variant: "success" })
      setLoading(false)
    } catch (error) {
      enqueueSnackbar("Error while fetching Announcement", { variant: "error" })
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHostels();
    fetchAnnouncement()
    fetchRequest()
  }, []);


  const onAddHostelAnnouncemnt = () => {
    navigate("/addAnnouncement", { state: { isEdit: false } })
  }

  const navigateToEdit = (announcedata: any) => {
    console.log('Navigating to edit with data:', announcedata);
    navigate('/addAnnouncement', { state: { isEdit: true, announcedata } });
  };

  const handaleView = (route: string, announcementdata?: any) => {
    console.log('Navigating to:', route, 'with data:', announcementdata);
    // Option 2: Use React Router with state (when you setup proper routing)
    navigate(route, { state: { announcementdata } });

  };

  const handaleViewRequest = (route: string, requestdata?: any) => {
    console.log('Navigating to:', route, 'with data:', requestdata);
    navigate(route, { state: { requestdata } });
  };


  const deleteRoomData = async (roomData?: any) => {
    setDeleteAnnouncementID(roomData?._id);
    setOpenDeleteModel(true);
    console.log('Deleting room data:', roomData);
  };


  const confirmToDelete = async () => {
    console.log('Deleting room data:', deleteAnnouncementID);
    try {
      await deleteAnnouncement(deleteAnnouncementID);
      enqueueSnackbar('Room deleted successfully', { variant: 'success' });
      fetchAnnouncement();
      setOpenDeleteModel(false); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };




  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'hostelName', headerName: 'Hostel Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 1 }}>

          <VisibilityIcon
            fontSize="small"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              console.log('Hostel data:', params.row);
              handaleView('/viewAnnouncement', params.row);
            }}
          />
          <EditIcon
            fontSize="small"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              console.log('hostel data: edit', params.row);
              navigateToEdit(params.row);
            }}
          />
          <DeleteIcon
            fontSize="small"
            color="error"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              // Store room data in localStorage for props management
              deleteRoomData(params.row);
            }}
          />
        </Box>
      ),
    },
  ];

  const columnsRequest = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'hostelName', headerName: 'Hostel Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'solution', headerName: 'Resolution', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 1 }}>

          <VisibilityIcon
            fontSize="small"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              console.log('Hostel data:', params.row);
              handaleViewRequest('/viewRequest', params.row);
            }}
          />
        </Box>
      ),
    },
  ];

  const closeModel = async () => {
    setOpenDeleteModel(false);
  };




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
              boxShadow={`rgba(2, 10, 225, 0.92) 2px 2px 1px 0px`}
              border={` 1px solid rgba(2, 10, 225, 0.92)`}
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
              boxShadow={`rgba(2, 10, 225, 0.92) 2px 2px 1px 0px`}
              border={` 1px solid rgba(2, 10, 225, 0.92)`}
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
              boxShadow={`rgba(2, 10, 225, 0.92) 2px 2px 1px 0px`}
              border={` 1px solid rgba(2, 10, 225, 0.92)`}
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
              boxShadow={`rgba(2, 10, 225, 0.92) 2px 2px 1px 0px`}
              border={` 1px solid rgba(2, 10, 225, 0.92)`}
            />
          </Box>
        </Fade>
      </Box>

      <Box sx={{ backgroundColor: 'white' }}>
        <Box sx={{ mb: 2, pt: 2, pl: 1 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            All Announcement
          </Typography>
        </Box>
        {
          announcement?.length > 0 &&
          <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
              rows={announcement}
              columns={columns}
            />
          </Box>
        }
        {!loading && announcement?.length === 0 && (
          <Paper
            sx={{
              p: 8,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.action.hover})`
            }}
          >
            <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 64, height: 64 }}>
              <Home fontSize="large" />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Announcement yet
            </Typography>
            {!announcement?.length && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAddHostelAnnouncemnt}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                }}
              >
                Add Annoucement
              </Button>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, mt: 3 }}>
              Get started by adding your first Announcement to the system.
            </Typography>
          </Paper>
        )}
      </Box>

      <Box sx={{ backgroundColor: 'white', mt: 5 }}>
        {
          requestdata?.length > 0 && <Box sx={{ backgroundColor: 'white', marginTop: 5 }}>
            <Box sx={{ mb: 2, pt: 2, pl: 1 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                All Requests
              </Typography>
            </Box>

            <Box sx={{ height: '100%', width: '100%' }}>
              <DataGrid
                rows={requestdata}
                columns={columnsRequest}
              />
            </Box>
          </Box>
        }
        {!loading && requestdata?.length === 0 && (
          <Paper
            sx={{
              p: 8,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.action.hover})`
            }}
          >
            <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 64, height: 64 }}>
              <Home fontSize="large" />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Requests yet
            </Typography>
          </Paper>
        )}
      </Box>
      {
        openDeleteModel && (
          <DeleteModel
            confirmToDelete={confirmToDelete}
            deleteId={deleteAnnouncementID}
            closeModel={closeModel}
            deleteText="Room"
          />
        )
      }
    </Container>
  );
};

export default WardenDashboard;
