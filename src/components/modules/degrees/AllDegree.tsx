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
import { enqueueSnackbar } from 'notistack';
import { deleteDegree, getAllDegrees } from '../../auth/api/studentApi';
import { HostelLoader } from '../../../utils/hostelLoader';
import { DataGrid } from '../../../utils/Datagrid';
import { DeleteModel } from '../../../utils/DeleteModal';


export default function AllDegree() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [degrees, setDegrees] = useState<any[]>([]);
  const [openDeleteModel, setOpenDeleteModel] = useState<boolean>(false);
  const [deleteDegreeID, setDeleteDegreeID] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 });
  const theme = useTheme();

  const closeModel = async () => {
    setOpenDeleteModel(false);
  };

  
    const handlePaginationModelChange = (model: { page: number; pageSize: number }) => {
        setPaginationModel(model);
        // Optionally, you can fetch new data based on the pagination model
         fetAllDegrees(model.page, model.pageSize);
    };

  const fetAllDegrees = async (page: number, pageSize: number) => {
    try {
      setLoading(true);
      console.log('Fetching rooms with pagination:', { page, pageSize });
      const response = await getAllDegrees(page, pageSize);
      console.log('Fetched degrees:', response.data);
      let objdata: any = []
      let data: any = response?.data?.map((degree: any) => {
        let obj = {
          _id: degree?._id,
          degreeName: degree?.degreeName,
          AdmissionYear: degree?.AdmissionYear ? new Date(degree?.AdmissionYear)?.toLocaleDateString() : null,
          degreeYear:  degree?.degreeYear ? new Date(degree?.degreeYear)?.toLocaleDateString() : null,
          departmentName: degree?.departmentName,
        };
        objdata.push(obj);
      });
      console.log('Processed rooms data:', objdata);
      setDegrees(objdata);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetAllDegrees(paginationModel.page, paginationModel.pageSize);
  }, []);

  const handleAddDegree = () => {
    navigate('/addDegree', { state: { isEdit: false } });
  };

  const navigateToEdit = (degreeData: any) => {
    console.log('Navigating to edit with data:', degreeData);
    navigate('/addDegree', { state: { isEdit: true, degreeData } });
  };

  // const handaleView = (route: string, hosteldata?: any) => {
  //   console.log('Navigating to:', route, 'with data:', hosteldata);
  //   // Option 2: Use React Router with state (when you setup proper routing)
  //   navigate(route, { state: { hosteldata } });

  // };


  const deleteDegreeData = async (degreeData?: any) => {
    setDeleteDegreeID(degreeData?._id);
    setOpenDeleteModel(true);
    console.log('Deleting hostel data:', degreeData);
  };

  const confirmToDelete = async () => {
    console.log('Deleting hostel data:', deleteDegreeID);
    try {
      await deleteDegree(deleteDegreeID);
      fetAllDegrees(paginationModel.page, paginationModel.pageSize);
      setOpenDeleteModel(false); // Refresh the list after deletion
      enqueueSnackbar("degree deleted successfully", {variant:"success"})
    } catch (error) {
      console.error('Error deleting hostel:', error);
      enqueueSnackbar(error.message, {variant:"error"})
    }
  };


  const columns = [
    { field: 'degreeName', headerName: 'Degree Name', flex: 1 },
    { field: 'departmentName', headerName: 'Department Name', flex: 1 },
    { field: 'AdmissionYear', headerName: 'Admission Year', flex: 1 },
    { field: 'degreeYear', headerName: 'Degree Year', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
{/* 
          <VisibilityIcon
            fontSize="small"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              console.log('Hostel data:', params.row);
              handaleView('/viewDegree', params.row);
            }}
          /> */}
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
              deleteDegreeData(params.row);
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
        <Grid item xs={12} md={12} sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.palette.background.paper, padding: 2, borderRadius: 1 }}>
          <Typography variant="h4" gutterBottom>
            All Degree
          </Typography>
          <Button variant="contained" color="primary" onClick={handleAddDegree}>
            Create Degree
          </Button>
        </Grid>

        <Box sx={{ height: '100%', width: '100%' }}>
          <DataGrid rows={degrees} columns={columns} onPaginationModelChange={handlePaginationModelChange} />
        </Box>

        {
          openDeleteModel && (
            <DeleteModel
              confirmToDelete={confirmToDelete}
              deleteId={deleteDegreeID}
              closeModel={closeModel}
              deleteText="Degree"
            />
          )
        }
      </Grid>
    </>
  )
}