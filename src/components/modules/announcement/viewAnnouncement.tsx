import { ArrowBack, } from '@mui/icons-material';
import { Avatar, Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useLocation } from 'react-router-dom';
import TabIcon from '@mui/icons-material/Tab';

export default function AnnouncementDetailsPage() {

    const location = useLocation();
    let { announcementdata } = location?.state || {};
    const onNavigateBack = () => {
        window.history.back();
    };
    console.log('Hostel ID:', announcementdata);

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
                    Announcement Details
                </Typography>
            </Box>

            {/* Data Source Indicator */}
            {announcementdata ? (
                <Paper sx={{ p: 2, mb: 3, bgcolor: '#e8f5e8', borderRadius: 2 }}>
                    <Typography variant="body2" color="success.main">
                        ✓ Displaying data for specific Announcement: {announcementdata?.title}
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
                            {announcementdata?.title || 'Announcement Name'}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
                        <TabIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="body2" color="text.secondary">Hostel Name</Typography>
                            <Typography variant="body1">{announcementdata?.hostelName}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
                        <TabIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="body2" color="text.secondary">Description</Typography>
                            <Typography variant="body1">{announcementdata?.description}</Typography>
                        </Box>
                    </Box>

                    {
                        announcementdata?.document?.length > 0 && <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
                            {
                                announcementdata?.document?.map((item: any, index: any) => {
                                    return (<Box key={index}>
                                        <img src={item?.url} alt={item?.name} height={60} width={60} style={{borderRadius:2}} />
                                        <Typography variant="body1">{item?.name}</Typography>
                                    </Box>)
                                })
                            }

                        </Box>
                    }



                </Box>
            </Paper>
        </Box>
    )
}
