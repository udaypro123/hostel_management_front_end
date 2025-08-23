import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    useTheme,
    Fade,
} from '@mui/material';
import {
    Home,
    People,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { HostelLoader } from '../../utils/hostelLoader';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { StatCard } from '../../utils/StatCard';
import { getStudentById } from '../auth/api/studentApi';
import { enqueueSnackbar } from 'notistack';
import { getPaymentByID } from '../auth/api/paymentApi';
import { DataGrid } from '../../utils/Datagrid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAnnouncement } from '../auth/api/announcementApi';
import { getRequests } from '../auth/api/requests.Api';

interface HostelDashboardProps {
    onViewAllHostels?: () => void;
    onAddHostel?: () => void;
    onViewHostelDetails?: (id: string) => void;
}

const StudentDashboard: React.FC<HostelDashboardProps> = ({ }) => {
    const theme = useTheme();
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false);
    const [hostels, setHostels] = useState<any>();
    const [paidAmount, setPaidAmount] = useState<any>(0);
    const [announcement, setAnnouncement] = useState<any[]>([]);
    let data = localStorage.getItem('user') || '{}';
    const [requestdata, setRequestdata] = useState<any>([]);
    const user = JSON.parse(data);
    console.log('User data:', user);


    const fetchStudentById = async () => {
        try {
            setLoading(true);
            const response = await getStudentById(user?.id);
            console.log('Fetched hostels:', response.data);
            setHostels(response.data);
        } catch (error) {
            console.error('Error fetching hostels:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentById();
    }, []);

    useEffect(() => {
        fetchAnnouncement()
        fetchRequest()
    }, [hostels]);

    const getStudentPaymentBYId = async () => {
        try {
            const data = await getPaymentByID(user.id)
            console.log("afamdscsdc", data?.data)
            let amount: any = 0
            let filterdata: any = data?.data?.filter((item: any) => item?.studentId?._id == user.id)
            filterdata?.map((item: any, index: number) => {
                amount += item?.amountPaid
                return {
                    id: index + 1,
                    name: item?.studentId?.fullName || `${item?.studentId?.firstName || '-'} ${item?.studentId?.lastName || '-'}`.trim(),
                    dob: item?.studentId?.dateOfBirth
                        ? new Date(item.studentId.dateOfBirth).toLocaleDateString()
                        : '-',
                    email: item?.studentId?.email || '-',
                    phone: item?.studentId?.phoneNumber || '-',
                    address: item?.studentId?.address?.country || '-',
                    feeType: item?.feeType || '-',
                    receiptString: item?.recieptString || '-',
                    amount: item?.amountPaid || '-',
                    _id: item?._id
                }
            });

            setPaidAmount(amount)

            // enqueueSnackbar("fetch payment list successfully", { variant: "success" })
        } catch (error) {
            enqueueSnackbar("error fetching data of payment ", { variant: "error" })

        }
    }

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
            const announcedata = await getAnnouncement()
            console.log("announcedata", announcedata)
            let filterDta: any = announcedata?.data?.filter((item: any) => (item?.hostel
                ?._id === hostels?.hostelId?._id))
            console.log("filterDtafilterDta", filterDta, hostels)
            let obj: any = [];

            filterDta?.map((item: any, index: number) => {
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

    const handaleView = (route: string, announcementdata?: any) => {
        console.log('Navigating to:', route, 'with data:', announcementdata);
        // Option 2: Use React Router with state (when you setup proper routing)
        navigate(route, { state: { announcementdata } });

    };

    const handaleViewRequest = (route: string, requestdata?: any) => {
        console.log('Navigating to:', route, 'with data:', requestdata);
        // Option 2: Use React Router with state (when you setup proper routing)
        navigate(route, { state: { requestdata } });

    };

    const columns = [
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
                            handaleView('/viewAnnouncement', params.row);
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


    useEffect(() => {
        getStudentPaymentBYId()
    }, [])



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
                    Overview of your details please review .....
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                <Fade in timeout={300}>
                    <Box sx={{ flex: '1 1 250px', minWidth: 250, cursor: "pointer" }} onClick={() => navigate("/hostels")} >
                        <StatCard
                            title="Hostel Name"
                            value={hostels?.hostelId?.hostelName || "-"}
                            icon={<Home />}
                            color={theme.palette.primary.main}
                            boxShadow={`rgba(2, 10, 225, 0.92) 2px 2px 1px 0px`}
                            border={` 1px solid rgba(2, 10, 225, 0.92)`}
                        />
                    </Box>
                </Fade>

                <Fade in timeout={400}>
                    <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
                        <StatCard
                            title="Room Number"
                            value={hostels?.roomId?.roomNumber || "Not Assign"}
                            icon={<MeetingRoomIcon />}
                            color={theme.palette.success.main}
                            boxShadow={`rgba(2, 10, 225, 0.92) 2px 2px 1px 0px`}
                            border={` 1px solid rgba(2, 10, 225, 0.92)`}
                        // subtitle={`${stats?.totalOccupancy || 0} occupied`}
                        //   progress={stats?.averageOccupancyRate || 0}
                        />
                    </Box>
                </Fade>

                <Fade in timeout={500}>
                    <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
                        <StatCard
                            title="Warden Name"
                            value={hostels?.hostelId?.wardenName}
                            icon={<People />}
                            color={theme.palette.warning.main}
                            boxShadow={`rgba(2, 10, 225, 0.92) 2px 2px 1px 0px`}
                            border={` 1px solid rgba(2, 10, 225, 0.92)`}
                        />
                    </Box>
                </Fade>
                <Fade in timeout={600}>
                    <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
                        <StatCard
                            title={`Fee Paid Rs. ${paidAmount}`}
                            value={hostels?.roomId?.rent || 0}
                            icon={<MonetizationOnIcon />}
                            color={theme.palette.info.main}
                            boxShadow={`rgba(2, 10, 225, 0.92) 2px 2px 1px 0px`}
                            border={` 1px solid rgba(2, 10, 225, 0.92)`}
                            progress={
                                Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        ((paidAmount ?? 0) / (hostels?.roomId?.rent || 1)) * 100
                                    )
                                )
                            }
                        />
                    </Box>
                </Fade>
            </Box>

            {/* all announcement */}
            {
                announcement?.length > 0 && <Box sx={{ backgroundColor: 'white' }}>
                    <Box sx={{ mb: 2, pt: 2, pl: 1 }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                            All Announcement
                        </Typography>
                    </Box>

                    <Box sx={{ height: '100%', width: '100%' }}>
                        <DataGrid
                            rows={announcement}
                            columns={columns}
                        />
                    </Box>

                </Box>
            }

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
        </Container>
    );
};

export default StudentDashboard;
