import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    TextField,
    Button,
    Alert,
    Avatar,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ArrowBack, MeetingRoom as RoomIcon, Save as SaveIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { getHostels} from '../../auth/api/hostelApi';
import { HostelLoader } from '../../../utils/hostelLoader';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createRequest, updateRequest } from '../../auth/api/requests.Api';

const AddRequest: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        hostel: '',
        title: '',
        document: { name: "", url: "" },
        description: '',
        solution: '',
        status: 'pending',
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [isLoading, setIsLoading] = useState(false);

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [hostels, setHostels] = useState<any[]>([]);
    const { isEdit, requestdata } = useLocation().state || { isEdit: false };



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                document: {
                    name: file.name,
                    url: reader.result as string,
                },
            }));
        };
        reader.readAsDataURL(file);
    };

    const fetchHostels = async () => {
        try {
            setIsLoading(true);
            const response = await getHostels();
            console.log('Fetched hostels:', response.data);
            setHostels(response.data);
        } catch (error) {
            console.error('Error fetching hostels:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHostels();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData?.title || !formData?.hostel) {
            setError('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {

            let hostel: any = formData.hostel;
            let announment: any = {
                hostel,
                title: formData.title,
                document: formData.document,
                description: formData.description,
                solution: formData.solution || '',
                status: formData.status || 'pending',
                createdBy: user.id,
            };

            console.log("announment 1", announment)
            if (isEdit && requestdata) {
                announment._id = requestdata._id;
                announment.updatedBy = user.id;
            }
            if (isEdit && requestdata) {
                console.log("announment 3", announment)
                await updateRequest(announment);
                setSuccess('Request updated successfully!');
                enqueueSnackbar('Request updated successfully!', { variant: 'success' });
                navigate('/request'); // Redirect to rooms page after update
            } else {
                console.log("announment 2", announment)
                await createRequest(announment);
                setSuccess('Request added successfully!');
                enqueueSnackbar('Request added successfully!', { variant: 'success' });
                navigate('/request'); // Redirect to rooms page after addition
            }
            // Reset form
            setFormData({
                hostel: '',
                title: '',
                document: { name: "", url: "" },
                description: '',
                solution: '',
                status: 'pending',
            });
        } catch (err) {
            setError('Failed to add room. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const onNavigateBack = () => {
        window.history.back();
    };

    useEffect(() => {
        if (isEdit && requestdata) {
            setFormData({
                document:requestdata?.document[0],
                hostel: requestdata?.hostelId || '',
                title: requestdata?.title || '',
                description: requestdata?.description || '',
                solution: requestdata?.solution || '',
                status: requestdata?.status || 'pending',
            });
        }
    }, [isEdit, requestdata]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <HostelLoader />
            </Box>
        );
    }


    return (
        <Box sx={{ backgroundColor: "white", width: "80%", margin: "auto", padding: 2, borderRadius: 1, boxShadow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={onNavigateBack}
                    sx={{ width: '10%', mr: 2, fontWeight: 'bold', color: 'primary.main', fontSize: '1.3rem' }}
                >
                    Back
                </Button>
                <Box sx={{ width: "95%", display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        <RoomIcon />
                    </Avatar>
                    <Typography variant="h4" component="h1" fontWeight="bold" mr={10}>
                        {isEdit ? `Edit Request ` : 'Add Request'}
                    </Typography>
                </Box>

            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} mt={8}>
                <Grid container spacing={3} sx={{ width: '100%' }}>

                    <Box sx={{ width: "48%" }} >
                        <FormControl fullWidth required>
                            <InputLabel id="hostel-label">Hostel</InputLabel>
                            <Select
                                labelId="hostel-label"
                                id="hostel"
                                name="hostel"
                                value={formData.hostel}
                                label="Hostel"
                                onChange={(e: any) => handleChange(e)}
                                disabled={isLoading}
                            >
                                {hostels.map((hostel: any) => (
                                    <MenuItem key={hostel?._id} value={hostel?._id}>
                                        {hostel?.hostelName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ width: "48%" }}>
                        <TextField
                            fullWidth
                            id="title"
                            label="title/Reason"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </Box>

                    <Box sx={{ width: "98%", height: "10rem" }}>
                        <input
                            accept="image/*,application/pdf"
                            type="file"
                            id="file-upload"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            disabled={isLoading}
                        />
                        <Typography pb={1}>Upload file</Typography>
                        <label htmlFor="file-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                style={{ width: "100%", height: "80%" }}
                                startIcon={<CloudUploadIcon style={{ width: "40%", height: "40%", margin: "auto" }} />}
                                disabled={isLoading}
                            >
                            </Button>
                        </label>

                        {formData.document.name && (
                            <Typography variant="body2" sx={{ mt: 1, mb: 3, fontSize: 18 }}>
                                {formData.document.name}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ width: "98%", mt: 2 }}>
                        <TextField
                            fullWidth
                            id="description"
                            label="Description your request"
                            name="description"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="Additional details about the room..."
                        />
                    </Box>

                    {/* reset and save button */}
                    <Box sx={{ width: "96%" }}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', width: '100%', }}>
                            <Button
                                type="button"
                                variant="outlined"
                                disabled={isLoading}
                                onClick={() => setFormData({
                                    hostel: '',
                                    title: '',
                                    document: { name: "", url: "" },
                                    description: '',
                                    solution: '',
                                    status: 'pending',
                                })}
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                                sx={{ minWidth: 120 }}
                            >
                                {isLoading ? 'Adding...' : isEdit ? "Update Request" : 'Add Request'}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Box>
        </Box>
    );
};

export default AddRequest;
