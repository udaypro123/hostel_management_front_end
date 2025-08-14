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
import { enqueueSnackbar } from 'notistack';
import { deleteRoom, getAllRooms } from '../../auth/api/hostelApi';
import { HostelLoader } from '../../../utils/hostelLoader';
import { DataGrid } from '../../../utils/Datagrid';
import { DeleteModel } from '../../../utils/DeleteModal';



export default function AllRooms() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [rooms, setRooms] = useState<any[]>([]);
    const [openDeleteModel, setOpenDeleteModel] = useState<boolean>(false);
    const [deleteRoomID, setDeleteRoomID] = useState<string>("");
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });


    const handlePaginationModelChange = (model: { page: number; pageSize: number }) => {
        setPaginationModel(model);
        // Optionally, you can fetch new data based on the pagination model
         fetchRooms(model.page, model.pageSize);
    };

    const theme = useTheme();

    const closeModel = async () => {
        setOpenDeleteModel(false);
    };

    const fetchRooms = async (page: number, pageSize: number) => {
        try {
            setLoading(true);
            console.log('Fetching rooms with pagination:', { page, pageSize });
            const response = await getAllRooms(page, pageSize);
            console.log('Fetched rooms:', response.data);
            let objdata:any=[]
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
        fetchRooms(paginationModel.page, paginationModel.pageSize);
    }, []);

    const handleAddRoom = () => {
        navigate('/addroom', { state: { isEdit: false } });
    };

    const navigateToEdit = (roomdata: any) => {
        console.log('Navigating to edit with data:', roomdata);
        navigate('/addroom', { state: { isEdit: true, roomdata } });
    };

    const handaleView = (route: string, roomdata?: any) => {
        console.log('Navigating to:', route, 'with data:', roomdata);
        // Option 2: Use React Router with state (when you setup proper routing)
        navigate(route, { state: { roomdata } });

    };


    const deleteRoomData = async (roomData?: any) => {
        setDeleteRoomID(roomData?._id);
        setOpenDeleteModel(true);
        console.log('Deleting room data:', roomData);
    };

    const confirmToDelete = async () => {
        console.log('Deleting room data:', deleteRoomID);
        try {
            await deleteRoom(deleteRoomID);
            enqueueSnackbar('Room deleted successfully', { variant: 'success' });
            fetchRooms(paginationModel.page, paginationModel.pageSize);
            setOpenDeleteModel(false); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };


    const columns = [
        { field: 'roomNumber', headerName: 'Room Number', flex: 1 },
        { field: 'hostelName', headerName: 'Hostel Name', flex: 1 },
        { field: 'rent', headerName: 'Rent (₹)', flex: 1 },
        { field: 'capacity', headerName: 'Capacity', flex: 1 },
        { field: 'occupancy', headerName: 'Occupancy', flex: 1 },
        { field: 'floor', headerName: 'Floor', flex: 1 },
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
                            // Store room data in localStorage for props management
                            deleteRoomData(params.row);
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
                        All Rooms
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleAddRoom}>
                        Add Room
                    </Button>
                </Grid>

                <Box sx={{ height: '100%', width: '100%' }}>
                    <DataGrid
                        rows={rooms}
                        columns={columns}
                        paginationModel={paginationModel}
                        onPaginationModelChange={handlePaginationModelChange}
                    />
                </Box>

                {
                    openDeleteModel && (
                        <DeleteModel
                            confirmToDelete={confirmToDelete}
                            deleteId={deleteRoomID}
                            closeModel={closeModel}
                            deleteText="Room"
                        />
                    )
                }
            </Grid>
        </>
    )
}