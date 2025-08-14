import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid } from '../../../utils/Datagrid';
import { HostelLoader } from '../../../utils/hostelLoader';
import { DeleteModel } from '../../../utils/DeleteModal';
import { deleteAnnouncement, getAnnouncement } from '../../auth/api/announcementApi';
import { enqueueSnackbar } from 'notistack';

const Announcements: React.FC = () => {

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [announceMentdata, setAnnounceMentdata] = useState<any>([]);
  const [openDeleteModel, setOpenDeleteModel] = useState<boolean>(false);
  const [deleteAnnouncementID, setDeleteAnnouncementID] = useState<string>("");


  const fetchAnnouncement = async () => {
    try {
      setIsLoading(true)
      const announcedata = await getAnnouncement()
      console.log("announcedata", announcedata)
      let obj: any = [];
      announcedata?.data?.map((item: any, index: number) => {
        let newobj = {
          id:index+1,
          title: item?.title,
          description: item?.description,
          hostelName: item?.hostel?.hostelName,
          document: item?.document,
          _id:item?._id,
          hostelId:item?.hostel?._id,
        }
        console.log("newobj", newobj)
        obj.push(newobj)
      })
      console.log("newobjnewobj", obj)
      setAnnounceMentdata(obj)
      // enqueueSnackbar("fetched Announcement successfully ", { variant: "success" })
      setIsLoading(false)
    } catch (error) {
      enqueueSnackbar("Error while fetching Announcement", { variant: "error" })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncement()
  }, [])

  const handlRoundedAddAnnnouncement = () => {
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


  const deleteRoomData = async (roomData?: any) => {
    setDeleteAnnouncementID(roomData?._id);
    setOpenDeleteModel(true);
    console.log('Deleting room data:', roomData);
  };


  const confirmToDelete = async () => {
    console.log('Deleting room data:', deleteAnnouncementID);
    try {
      await deleteAnnouncement(deleteAnnouncementID);
      enqueueSnackbar('Announcement deleted successfully', { variant: 'success' });
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


  const closeModel = async () => {
    setOpenDeleteModel(false);
  };



  if (isLoading) {
    return <HostelLoader />
  }


  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handlRoundedAddAnnnouncement()}
        >
          New Announcement
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Announcements List */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Announcements
          </Typography>
          <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
              rows={announceMentdata}
              columns={columns}
            />
          </Box>

        </CardContent>
      </Card>
      {
        openDeleteModel && (
          <DeleteModel
            confirmToDelete={confirmToDelete}
            deleteId={deleteAnnouncementID}
            closeModel={closeModel}
            deleteText="Announcement"
          />
        )
      }
    </Box>
  );
};

export default Announcements;
