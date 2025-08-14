import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  useTheme,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { deleteHostel, getHostels } from '../../auth/api/hostelApi';
import { HostelLoader } from '../../../utils/hostelLoader';
import { DataGrid } from '../../../utils/Datagrid';
import { DeleteModel } from '../../../utils/DeleteModal';



export default function AllHostels() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [hostels, setHostels] = useState<any[]>([]);
  const [openDeleteModel, setOpenDeleteModel] = useState<boolean>(false);
  const [deleteHostelID, setDeleteHostelID] = useState<string>("");
  const theme = useTheme();

  const closeModel = async () => {
    setOpenDeleteModel(false);
  };

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const response = await getHostels();
      console.log('Fetched hostels:', response.data);
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

  const handleAddHostel = () => {
    navigate('/addhostel', { state: { isEdit: false } });
  };

  const navigateToEdit = (hosteldata: any) => {
    console.log('Navigating to edit with data:', hosteldata);
    navigate('/addhostel', { state: { isEdit: true, hosteldata } });
  };

  const handaleView = (route: string, hosteldata?: any) => {
    console.log('Navigating to:', route, 'with data:', hosteldata);
    // Option 2: Use React Router with state (when you setup proper routing)
    navigate(route, { state: { hosteldata } });

  };


  const deleteHostelData = async (hostelData?: any) => {
    setDeleteHostelID(hostelData?._id);
    setOpenDeleteModel(true);
    console.log('Deleting hostel data:', hostelData);
  };

  const confirmToDelete = async () => {
    console.log('Deleting hostel data:', deleteHostelID);
    try {
      await deleteHostel(deleteHostelID);
      fetchHostels();
      setOpenDeleteModel(false); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting hostel:', error);
    }
  };


  const columns = [
    { field: 'hostelName', headerName: 'Hostel Name', flex: 1 },
    { field: 'wardenName', headerName: 'Warden', flex: 1 },
    { field: 'totalRooms', headerName: 'Total Rooms', flex: 1 },
    { field: 'capacity', headerName: 'Capacity', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
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
              handaleView('/viewHostel', params.row);
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
              // Store hostel data in localStorage for props management
              deleteHostelData(params.row);
            }}
          />
        </Box>
      ),
    },
  ];


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <HostelLoader />
      </Box>
    );
  }


  return (
    <>
      <Grid container spacing={2} sx={{ padding: 2, backgroundColor: theme.palette.background.paper, }}>
        <Grid sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.palette.background.paper, padding: 2, borderRadius: 1 }}>
          <Typography variant="h4" gutterBottom>
            All Hostels
          </Typography>
          <Button variant="contained" color="primary" onClick={handleAddHostel}>
            Add Hostel
          </Button>
        </Grid>

        <Box sx={{ height: '100%', width: '100%' }}>
          <DataGrid rows={hostels} columns={columns} />
        </Box>

        {
          openDeleteModel && (
            <DeleteModel
              confirmToDelete={confirmToDelete}
              deleteId={deleteHostelID}
              closeModel={closeModel}
              deleteText="Hostel"
            />
          )
        }
      </Grid>
    </>
  )
}