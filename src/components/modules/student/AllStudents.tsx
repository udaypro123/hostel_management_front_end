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

import { DataGrid } from '../../../utils/Datagrid';
import { HostelLoader } from '../../../utils/hostelLoader';
import { deleteStudent, getStudents } from '../../auth/api/studentApi';
import { DeleteModel } from '../../../utils/DeleteModal';
import { enqueueSnackbar } from 'notistack';


export default function AllStudents() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [students, setStudents] = useState<any[]>([]);
  const [openDeleteModel, setOpenDeleteModel] = useState<boolean>(false);
  const [deleteStudentID, setDeleteStudentID] = useState<string>("");
  const theme = useTheme();

  const closeModel = async () => {
    setOpenDeleteModel(false);
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents();
      console.log('Fetched students:', response.data);
      let studentData:any = []
      response.data?.map((item: any, index:any) => {
        let obj = {
          id:index+1,
          name: `${item?.firstName} ${item?.lastName}`,
          dob: item?.dob ? new Date(item.dob).toLocaleDateString(): "-",
          joiningDate: item?.joiningDate ? new Date(item.joiningDate).toLocaleDateString(): "-",
          email: item?.email,
          phone: item?.phone,
          address: item?.address,
          enrolledDegree: item?.enrolledDegree?._id,
          hostelId: item?.hostelId?._id,
          roomId: item?.roomId?._id,
          enrolldegree: item?.enrolledDegree?.degreeName,
          _id:item?._id
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

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = () => {
    navigate('/addstudent', { state: { isEdit: false } });
  };

  const navigateToEdit = (studentData: any) => {
    console.log('Navigating to edit with data:', studentData);
    navigate('/addstudent', { state: { isEdit: true, studentData } });
  };

  const handaleView = (route: string, studentData?: any) => {
    console.log('Navigating to:', route, 'with data:', studentData);
    // Option 2: Use React Router with state (when you setup proper routing)
    navigate(route, { state: { studentData } });

  };


  const deleteStudentData = async (studentData?: any) => {
    setDeleteStudentID(studentData?._id);
    setOpenDeleteModel(true);
    console.log('Deleting student data:', studentData);
  };

  const confirmToDelete = async () => {
    console.log('Deleting student data:', deleteStudentID);
    try {
      await deleteStudent(deleteStudentID);
      enqueueSnackbar("Student deleted Sucessfully")
      fetchStudents();
      setOpenDeleteModel(false); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };


  const columns = [
    { field: 'name', headerName: 'Full Name', flex: 1 },
    { field: 'dob', headerName: 'Date Of Birth', flex: 1, },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Mobile Number', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'enrolldegree', headerName: 'Degree Name', flex: 1 },
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
              handaleView('/viewdStudent', params.row);
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
              // Store student data in localStorage for props management
              deleteStudentData(params.row);
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
            All Students
          </Typography>
          <Button variant="contained" color="primary" onClick={handleAddStudent}>
            Add Student
          </Button>
        </Grid>

        <Box sx={{ height: '100%', width: '100%' }}>
          <DataGrid rows={students} columns={columns} />
        </Box>

        {
          openDeleteModel && (
            <DeleteModel
              confirmToDelete={confirmToDelete}
              deleteId={deleteStudentID}
              closeModel={closeModel}
              deleteText="Student"
            />
          )
        }
      </Grid>
    </>
  )
}