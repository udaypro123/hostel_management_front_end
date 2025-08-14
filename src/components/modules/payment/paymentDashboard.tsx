import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    useTheme,
    Fade,
    Button,
    TextField,
    CircularProgress
} from '@mui/material';
import {
    Home,
    People,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { getStudentById } from '../../auth/api/studentApi';
import { HostelLoader } from '../../../utils/hostelLoader';
import { StatCard } from '../../../utils/StatCard';
import { enqueueSnackbar } from 'notistack';
import { createPaymentOrder, createPaymentTransaction, getPaymentByID } from '../../auth/api/paymentApi';
import { DataGrid } from '../../../utils/Datagrid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Grid } from '@mui/system';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { ReceiptModal } from '../../../utils/receiptModal';

interface HostelDashboardProps {
    onViewAllHostels?: () => void;
    onAddHostel?: () => void;
    onViewHostelDetails?: (id: string) => void;
}




const PaymentDashboard: React.FC<HostelDashboardProps> = ({ }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [hostels, setHostels] = useState<any>();
    const [customAmount, setCustomAmount] = useState<any>();
    const [receiptHtml, setReceiptHtml] = useState<any>();
    const [paymentRows, setpaymentRows] = useState<any>([]);
    const [paying, setPaying] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [paidAmount, setPaidAmount] = useState<any>(0);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    let data = localStorage.getItem('user') || '{}';
    const user = JSON.parse(data);
    console.log('User data:', user);

    const sourceUrll: any = window.location.host
    console.log(sourceUrll, "sourceUrl")

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

    const handlePay = async () => {
        try {
            // setLoading(true)
            setPaying(true);
            if (customAmount > hostels?.roomId?.rent) {
                enqueueSnackbar("can not pay more than assign fee", { variant: "error" });
                setPaying(false);
                return;
            }
            // Prepare payload according to paymentTransactionSchema
            const payload = {
                orderId: "",
                recieptId: null,
                amount: hostels?.roomId?.rent || 0,
                amountPaid: customAmount || hostels?.roomId?.rent || 0,
                studentId: user?.id,
                feeType: "Hostel Fee",
            };

            const response = await createPaymentTransaction(payload);
            console.log("response", response)
            if (response.code === 200) {
                enqueueSnackbar(`${response?.message}`, { variant: "success" });
                await createpaymentOrder(response?.data?._id)
            }
        } catch (error) {
            enqueueSnackbar("Payment error!", { variant: "error" });
            console.error("Payment error:", error);
        } finally {
            setPaying(false);
        }
    }

    const createpaymentOrder = async (transactionId: any) => {
        console.log("transactionId", transactionId)
        try {

            const payload = {
                orderId: "",
                amount: hostels?.roomId?.rent || 0,
                amountPaid: customAmount || hostels?.roomId?.rent || 0,
                studentId: user?.id,
                feeType: "Hostel Fee",
                paymentTransactionId: transactionId,
                contact: user?.phoneNumber,
                email: user.email,
                sourceUrl: sourceUrll,
                roomNumber: hostels?.roomId?.roomNumber,
                hostelName: hostels?.hostelId?.hostelName,
            };

            const responses = await createPaymentOrder(payload);
            enqueueSnackbar("payment order created successfully !", { variant: "success" })
            console.log("responses", responses?.data?.payment_url)
            if (responses?.data?.payment_url) {
                window.location.href = responses.data.payment_url;
            } else {
                enqueueSnackbar("Payment URL not found!", { variant: "error" });
            }

        } catch (error) {
            enqueueSnackbar("failed to create order", { variant: "error" })
        }
    }

    const getStudentPaymentBYId = async () => {
        try {
            const data = await getPaymentByID(user.id)
            console.log("afamdscsdc", data?.data)
            let filterdata: any;
            if (user.role !== "admin") {
                filterdata = data?.data?.filter((item: any) => item?.studentId?._id == user?.id)
            }else{
                filterdata=data?.data
            }
            let amount: any = 0
            const rows = filterdata?.map((item: any, index: number) => {
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

            setpaymentRows(rows)
            console.log("data---->", rows)
            enqueueSnackbar("fetch payment list successfully", { variant: "success" })
        } catch (error) {
            enqueueSnackbar("error fetching data of payment ", { variant: "error" })

        }
    }

    useEffect(() => {
        getStudentPaymentBYId()
    }, [])


    const navigateToreiept = async (row: any) => {
        console.log("rowssss", row)
        setOpenModal(true)
        setReceiptHtml(row?.receiptString)
        setOpen(true)
    }

    const handaleView = async (paymentData: any) => {
        console.log("paymentDatannn", paymentData)
        navigate("/viewPayment", { state: paymentData })
    }

    const columns = [
        { field: 'name', headerName: 'Full Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phone', headerName: 'Mobile Number', flex: 1 },
        { field: 'amount', headerName: 'Amount (paid)', flex: 1, },
        { field: 'feeType', headerName: 'Fee Type', flex: 1 },
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
                            handaleView(params.row);
                        }}
                    />
                    <ReceiptIcon
                        fontSize="small"
                        color="primary"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                            navigateToreiept(params.row)
                        }}
                    />
                </Box>
            ),
        },
    ];

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
                    {user?.role == "student" ? "  Pay Your Hostel Fee!" : "All Students Recieve Payment"}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {user?.role == "student" ? "pay your hostel fee and make live easy." : "Mangage Student payments"}
                </Typography>
            </Box>

            {
                user?.role == "student" && <>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                        <Fade in timeout={300}>
                            <Box sx={{ flex: '1 1 250px', minWidth: 250, cursor: "pointer" }} onClick={() => navigate("/hostels")} >
                                <StatCard
                                    title="Hostel Name"
                                    value={hostels?.hostelId?.hostelName || "-"}
                                    icon={<Home />}
                                    color={theme.palette.primary.main}
                                // subtitle={`${stats?.activeHostels || 0} active`}
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
                                //   progress={stats?.averageOccupancyRate || 0}
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
                    <Box sx={{ display: 'flex', flexDirection: "column", flexWrap: 'wrap', gap: 3, mb: 4, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
                        <TextField type="number" label="custom amount" style={{ marginTop: "20px", }} value={customAmount}
                            onChange={(e: any) => setCustomAmount(e.target.value)} />
                        <Button
                            variant='contained'
                            onClick={handlePay}
                            style={{ marginBottom: "20px", minWidth: 120 }}
                            disabled={paying}
                        >
                            {paying ? (
                                <>
                                    <span style={{ marginRight: 8 }}>Processing</span>
                                    <span><CircularProgress size={20} color="inherit" /></span>
                                </>
                            ) : (
                                <>Pay Now {customAmount > 0 ? customAmount : (hostels?.roomId?.rent - paidAmount)}</>
                            )}
                        </Button>
                    </Box>
                </>
            }

            <Box sx={{ height: '100%', width: '100%', backgroundColor: 'white', borderRadius: 1 }}>
                <Grid pt={2} pl={2} >
                    <Typography variant='h5' mb={3} >All Payments</Typography>
                </Grid>
                <DataGrid rows={paymentRows} columns={columns} />
            </Box>

            {
                openModal && <ReceiptModal receiptHtml={receiptHtml} handleOpen={handleOpen} handleClose={handleClose} open={open} />
            }
        </Container>
    );
};

export default PaymentDashboard;
