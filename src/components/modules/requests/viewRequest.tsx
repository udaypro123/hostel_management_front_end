import { ArrowBack, } from '@mui/icons-material';
import { Avatar, Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useLocation } from 'react-router-dom';
import TabIcon from '@mui/icons-material/Tab';
import { updateRequest } from '../../auth/api/requests.Api';
import { enqueueSnackbar } from 'notistack';
import { RequestModal } from '../../../utils/DeleteModal';
import { useState } from 'react';

export default function RequestDetailsPage() {

    const location = useLocation();
    let { requestdata } = location?.state || {};
    const [openRequestModel, setOpenRequestModel] = useState<boolean>(false);
    const [status, setStatus] = useState<string | null>(null);
    const [solution, setSolution] = useState<string | null>(null);
    let data = localStorage.getItem('user') || '{}';
    const user = JSON.parse(data);
    console.log('User data:', user);


    const onNavigateBack = () => {
        window.history.back();
    };

    const handleRequestModel = (status: string | null) => {
        if (!status) {
            console.warn('No status provided to handleRequestModel');
            return;
        }
        setStatus(status);
        setOpenRequestModel(true);
    };


    const handleRequest = async (status: string | null) => {

        if (!status) {
            console.warn('No status provided to handleRequest');
            return;
        }
        
        console.log('Handling request with status:', status);
        try {
            let announment: any = {
                status: status,
                solution: solution,
                updatedBy: user.id,
                _id: requestdata._id,
            };
            if (status === "Rejected") {
                await updateRequest(announment);
                enqueueSnackbar('Request rejected successfully', { variant: 'success' });
                window.history.back();
            } else {
                await updateRequest(announment);
                enqueueSnackbar('Request approved successfully', { variant: 'success' });
                window.history.back();
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    const closeModel = async () => {
        setOpenRequestModel(false);
    };


    console.log('Hostel ID:', requestdata);

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={onNavigateBack}
                    sx={{ mr: 2, fontWeight: 'bold', color: 'primary.main', fontSize: '1.3rem' }}
                >
                    Back
                </Button>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', textAlign: 'center', flexGrow: 1, mr: 8 }}>
                    Request Details
                </Typography>
            </Box>

            {/* Data Source Indicator */}
            {requestdata ? (
                <Paper sx={{ p: 2, mb: 3, bgcolor: '#e8f5e8', borderRadius: 2 }}>
                    <Typography variant="body2" color="success.main">
                        ✓ Displaying data for specific Request: {requestdata?.title}
                    </Typography>
                </Paper>
            ) : (
                <Paper sx={{ p: 2, mb: 3, bgcolor: '#fff3cd', borderRadius: 2 }}>
                    <Typography variant="body2" color="warning.main">
                        ⚠ No specific Announcement data provided. Showing sample data.
                    </Typography>
                </Paper>
            )}

            {/* Profile Section */}
            <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            mr: 3,
                            bgcolor: 'primary.main',
                            fontSize: '2rem'
                        }}
                    >
                        {/* {announcementdata.name[0]}{announcementdata.location[0]} */}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" color="text.secondary">
                            Reason : {requestdata?.title || 'Request Name'}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
                        <TabIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="body2" color="text.secondary">Hostel Name</Typography>
                            <Typography variant="body1">{requestdata?.hostelName}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
                        <TabIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="body2" color="text.secondary">Description</Typography>
                            <Typography variant="body1">{requestdata?.description}</Typography>
                        </Box>
                    </Box>

                    {
                        requestdata?.document?.length > 0 && <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
                            {
                                requestdata?.document?.map((item: any, index: any) => {
                                    return (<Box key={index}>
                                        <img src={item?.url} alt={item?.name} height={60} width={60} style={{ borderRadius: 2 }} />
                                        <Typography variant="body1">{item?.name}</Typography>
                                    </Box>)
                                })
                            }

                        </Box>
                    }


                    {
                        (user?.role === 'admin' || user?.role === 'warden') && <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '100%', gap: 2, justifyContent: 'flex-end', marginTop: 10 }}>
                            <Button variant="contained" onClick={() => handleRequestModel("Rejected")}>
                                Reject Request
                            </Button>
                            <Button variant="contained" onClick={() => handleRequestModel("Approved")}>
                                Approve Request
                            </Button>
                        </Box>
                    }

                </Box>
            </Paper>

            {
                openRequestModel && 
                <RequestModal
                    handleRequest={handleRequest}
                    status={status}
                    closeModel={closeModel}
                    setSolution={setSolution}
                />
            }

        </Box>
    )
}
