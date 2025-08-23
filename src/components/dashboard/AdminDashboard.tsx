import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  useTheme,
  Button,
  Fade
} from '@mui/material';
import {
  Home,
  People,
  Add,
} from '@mui/icons-material';
import { getAllRooms, getHostels } from '../auth/api/hostelApi';
import { useNavigate } from 'react-router-dom';
import { HostelLoader } from '../../utils/hostelLoader';
import { StatCard } from '../../utils/StatCard';
import { enqueueSnackbar } from 'notistack';
import { getWardens } from '../auth/api/wardenApi';
import { getStudents } from '../auth/api/studentApi';
import Face2Icon from '@mui/icons-material/Face2';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import { DataGrid } from '../../utils/Datagrid';
import { deleteAnnouncement, getAnnouncement } from '../auth/api/announcementApi';
import { DeleteModel } from '../../utils/DeleteModal';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getRequests } from '../auth/api/requests.Api';

interface HostelDashboardProps {
  onViewAllHostels?: () => void;
  onAddHostel?: () => void;
  onViewHostelDetails?: (id: string) => void;
}

const AdminDashboard: React.FC<HostelDashboardProps> = ({
  onAddHostel,
}) => {
  const theme = useTheme();
  const navigate = useNavigate()
  // const [stats, setStats] = useState<DashboardStats | null>(null);
  const [totalCapacity, setTotalCapacity] = useState<any>(0);

  // const [recentHostels, setRecentHostels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hostels, setHostels] = useState<any[]>([]);
  const [wardens, setWardens] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [announcement, setAnnouncement] = useState<any[]>([]);
  const [requestdata, setRequestdata] = useState<any>([]);
  const paginationModel = { page: 0, pageSize: 10 }
  const [openDeleteModel, setOpenDeleteModel] = useState<boolean>(false);
  const [deleteAnnouncementID, setDeleteAnnouncementID] = useState<string>("");

  const token = localStorage.getItem('token');
  console.log('Sending token:', token);
  let data = localStorage.getItem('user') || '{}';
  const user = JSON.parse(data);
  console.log('User data:', user);


  const fetchHostels = async () => {
    try {
      setLoading(true);
      const response = await getHostels();
      console.log('Fetched hostels:', response.data);
      let totalcapicity: any = 0
      response.data?.map((item: any) => {
        totalcapicity += item?.capacity
        return item
      })
      console.log("totalcapicity", totalcapicity)
      setTotalCapacity(totalcapicity)
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


  const fetchWardens = async () => {
    try {
      setLoading(true);
      const response = await getWardens();
      console.log('Fetched wardens:', response);
      let filterdata: any = response?.data?.filter((w: any) => w?.isActive)?.reverse();
      setWardens(filterdata || response);
    } catch (err: any) {
      enqueueSnackbar('Failed to fetch wardens. Please try again.', { variant: 'error' });
      console.error('Error fetching wardens:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents();
      console.log('Fetched students:', response.data);
      let studentData: any = []
      response.data?.map((item: any, index: any) => {
        let obj = {
          id: index + 1,
          name: `${item?.firstName} ${item?.lastName}`,
          dob: item?.dob ? new Date(item.dob).toLocaleDateString() : "-",
          joiningDate: item?.joiningDate ? new Date(item.joiningDate).toLocaleDateString() : "-",
          email: item?.email,
          phone: item?.phone,
          address: item?.address,
          enrolledDegree: item?.enrolledDegree?._id,
          hostelId: item?.hostelId?._id,
          roomId: item?.roomId?._id,
          enrolldegree: item?.enrolledDegree?.degreeName,
          _id: item?._id
        }
        studentData.push(obj)
      })
      setStudents(studentData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchRooms = async (page: number, pageSize: number) => {
    try {
      setLoading(true);
      console.log('Fetching rooms with pagination:', { page, pageSize });
      const response = await getAllRooms(page, pageSize);
      console.log('Fetched rooms:', response.data);
      let objdata: any = []
      response?.data?.map((room: any) => {
        let obj = {
          _id: room?._id,
          roomNumber: room?.roomNumber,
          capacity: room?.capacity,
          occupancy: room?.occupancy,
          floor: room?.floor,
          rent: room?.rent,
          hostelName: room?.hostelId?.hostelName,
          description: room?.description,
          hostelId: room?.hostelId?._id,
          createdAt: room?.createdAt,
          facilities: room?.facilities,
        };
        objdata.push(obj);
      });
      console.log('Processed rooms data:', objdata);
      setRooms(objdata);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchHostels();
    fetchWardens();
    fetchStudents();
    fetchRequest()
    fetchRooms(paginationModel.page, paginationModel.pageSize);
    fetchAnnouncement()
  }, []);



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
          <Box sx={{ flex: '1 1 250px', minWidth: 250, cursor: "pointer", maxWidth: 280 }} onClick={() => navigate("/hostels")} >
            <StatCard
              title="Total Hostels"
              value={hostels.length || 0}
              icon={<Home />}
              color={theme.palette.primary.main}
              boxShadow={`${theme.palette.primary.main} 2px 2px 1px 0px`}
              border={` 1px solid ${theme.palette.primary.main}`}
            // subtitle={`${stats?.activeHostels || 0} active`}
            />
          </Box>
        </Fade>

        <Fade in timeout={400}>
          <Box sx={{ flex: '1 1 250px', minWidth: 250, maxWidth: 280, cursor: "pointer" }}>
            <StatCard
              title="Total Capacity"
              value={totalCapacity || 0}
              icon={<People />}
              color={theme.palette.primary.main}
              boxShadow={`${theme.palette.primary.main} 2px 2px 1px 0px`}
              border={` 1px solid ${theme.palette.primary.main}`}
            // subtitle={`${stats?.totalOccupancy || 0} occupied`}
            // progress={stats?.averageOccupancyRate || 0}
            />
          </Box>
        </Fade>

        <Fade in timeout={500}>
          <Box sx={{ flex: '1 1 250px', minWidth: 250, maxWidth: 280, cursor: "pointer" }}>
            <StatCard
              title="Total Wardens"
              value={wardens?.length || 0}
              icon={<Face2Icon />}
              color={theme.palette.primary.main}
              boxShadow={`${theme.palette.primary.main} 2px 2px 1px 0px`}
              border={` 1px solid ${theme.palette.primary.main}`}
            // progress={stats?.averageOccupancyRate || 0}
            />
          </Box>
        </Fade>
        <Fade in timeout={600}>
          <Box sx={{ flex: '1 1 250px', minWidth: 250, maxWidth: 280, cursor: "pointer" }}>
            <StatCard
              title="Total Students"
              value={students?.length || 0}
              icon={<Diversity1Icon />}
              color={theme.palette.primary.main}
              boxShadow={`${theme.palette.primary.main} 2px 2px 1px 0px`}
              border={` 1px solid ${theme.palette.primary.main}`}
            // subtitle="From current occupancy"
            />
          </Box>
        </Fade>
        <Fade in timeout={600}>
          <Box sx={{ flex: '1 1 250px', minWidth: 250, maxWidth: 280, cursor: "pointer" }}>
            <StatCard
              title="Total Rooms"
              value={rooms?.length || 0}
              icon={<MapsHomeWorkIcon />}
              color={theme.palette.primary.main}
              boxShadow={`${theme.palette.primary.main} 2px 2px 1px 0px`}
              border={` 1px solid ${theme.palette.primary.main}`}
            // subtitle="From current occupancy"
            />
          </Box>
        </Fade>
      </Box>

      {/* All Announcement */}
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
            {onAddHostel && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAddHostel}
                sx={{ borderRadius: 2 }}
              >
                Add Your First Announcement
              </Button>
            )}
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

export default AdminDashboard;
