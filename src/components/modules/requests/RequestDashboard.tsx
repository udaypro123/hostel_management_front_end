import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
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
import { enqueueSnackbar } from 'notistack';
import { deleteRequest, getRequests } from '../../auth/api/requests.Api';

const RequestDashboard: React.FC = () => {

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [requestdata, setRequestdata] = useState<any>([]);
  const [openDeleteModel, setOpenDeleteModel] = useState<boolean>(false);
  const [deleteRequestID, setDeleteRequestID] = useState<string>("");
  let data:any = localStorage.getItem('user') || '{}';
  const user = JSON.parse(data);
  console.log('User data:', user);


  const fetchRequest = async () => {
    try {
      setIsLoading(true)
      const requestdata = await getRequests()
      console.log("requestdata", requestdata)
      let obj: any = [];
      const filterData: any = requestdata?.data?.filter((item: any) => item?.createdBy === user.id);
      filterData?.map((item: any, index: number) => {
        let newobj = {
          id: index + 1,
          title: item?.title,
          description: item?.description,
          hostelName: item?.hostel?.hostelName,
          document: item?.document,
          solution: item?.solution || "-",
          status: item?.status || "pending",
          _id: item?._id,
          hostelId: item?.hostel?._id,
        }
        console.log("newobj", newobj)
        obj.push(newobj)
      })
      console.log("newobjnewobj", obj)
      setRequestdata(obj)
      setIsLoading(false)
    } catch (error) {
      enqueueSnackbar("Error while fetching Request", { variant: "error" })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequest()
  }, [])

  const handlRoundedAddRequest = () => {
    navigate("/addRequest", { state: { isEdit: false } })
  }

  const navigateToEdit = (requestdata: any) => {
    console.log('Navigating to edit with data:', requestdata);
    navigate('/addRequest', { state: { isEdit: true, requestdata } });
  };

  const handaleView = (route: string, requestdata?: any) => {
    console.log('Navigating to:', route, 'with data:', requestdata);
    // Option 2: Use React Router with state (when you setup proper routing)
    navigate(route, { state: { requestdata } });

  };


  const deleteRequestData = async (requestData?: any) => {
    setDeleteRequestID(requestData?._id);
    setOpenDeleteModel(true);
    console.log('Deleting request data:', requestData);
  };


  const confirmToDelete = async () => {
    console.log('Deleting request data:', deleteRequestID);
    try {
      await deleteRequest(deleteRequestID);
      enqueueSnackbar('Request deleted successfully', { variant: 'success' });
      fetchRequest();
      setOpenDeleteModel(false); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'hostelName', headerName: 'Hostel Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
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
              handaleView('/viewRequest', params.row);
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
              // Store request data in localStorage for props management
              deleteRequestData(params.row);
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
          onClick={() => handlRoundedAddRequest()}
        >
          New Request
        </Button>
      </Box>

      {/* RequestDashboard List */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Request Dashboard
          </Typography>
          <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
              rows={requestdata}
              columns={columns}
            />
          </Box>

        </CardContent>
      </Card>
      {
        openDeleteModel && (
          <DeleteModel
            confirmToDelete={confirmToDelete}
            deleteId={deleteRequestID}
            closeModel={closeModel}
            deleteText="Request"
          />
        )
      }
    </Box>
  );
};

export default RequestDashboard;
