import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { ArrowBack, Home as HomeIcon, Save as SaveIcon } from '@mui/icons-material';

import { enqueueSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';
import { createHostel, updateHostel } from '../../auth/api/hostelApi';
import { HostelLoader } from '../../../utils/hostelLoader';
import { getWardens } from '../../auth/api/wardenApi';

const AddHostel: React.FC = () => {


  const location = useLocation();
  const isEdit = location.state?.isEdit || false;
  console.log('isEdit:', isEdit);
  console.log('Location state:', location.state.hosteldata);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hostelName: '',
    type: '',
    totalRooms: 0,
    capacity: 0,
    wardenId: '',
    address: '',
    wardenName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [wardens, setWardens] = useState<any[]>([]);
  console.log('AddHostel component rendered', formData);

  // Check authentication and role on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const authUser = localStorage.getItem('authUser');

      if (!token) {
        setError('You must be logged in to access this page. Please log in.');
        return;
      }

      if (authUser) {
        try {
          const user = JSON.parse(authUser);
          if (user.role !== 'admin' && user.role !== 'warden') {
            setError(`Access denied. Your role (${user.role}) is not authorized to create hostels. Only admin and warden roles can create hostels.`);
          }
        } catch (err) {
          console.error('Error parsing user data:', err);
          setError('Invalid user session. Please log in again.');
        }
      }
    };

    checkAuth();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchWardens = async () => {
    try {
      setIsLoading(true);
      const response = await getWardens();
      console.log('Fetched wardens:', response);
      let filterdata: any = response?.data?.filter((w: any) => w?.isActive)?.reverse();
      setWardens(filterdata || response);
    } catch (err: any) {
      enqueueSnackbar('Failed to fetch wardens. Please try again.', { variant: 'error' });
      console.error('Error fetching wardens:', err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchWardens();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check authentication before proceeding
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a hostel');
      return;
    }

    if (!formData.hostelName || !formData.type || !formData.totalRooms || !formData.capacity || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {

      if (isEdit && location?.state?.hosteldata) {
        console.log('Editing hostel data:', location.state.hosteldata);
        let updatedData = {
          hostelName: formData.hostelName,
          address: formData.address,
          type: formData.type,
          totalRooms: Number(formData.totalRooms),
          capacity: Number(formData.capacity),
          wardenId: formData.wardenId,
          wardenName: formData.wardenName
        };
        // Handle the edit logic here
        await updateHostel({hostelId:location.state.hosteldata._id, formData: updatedData});
        enqueueSnackbar('Hostel updated successfully!', { variant: 'success' });
        setSuccess('Hostel updated successfully!');
        navigate('/hostels');
        return;

      } else {
        await createHostel({
          hostelName: formData.hostelName,
          address: formData.address,
          type: formData.type,
          totalRooms: Number(formData.totalRooms),
          capacity: Number(formData.capacity),
          wardenId: formData.wardenId,
          wardenName: formData.wardenName,
        });
        enqueueSnackbar('Hostel added successfully!', { variant: 'success' });
        setFormData({
          hostelName: '',
          type: '',
          totalRooms: 0,
          capacity: 0,
          wardenId: '',
          address: '',
          wardenName: ''
        });
        navigate('/hostels');
      }
      console.log('Creating hostel with data:', formData);

    } catch (err: any) {
      console.error('Error creating hostel:', err);
      let errorMessage = 'Failed to add hostel. Please try again.';

      if (err?.message) {
        if (err.message.includes('Not authorized') || err.message.includes('unauthorized')) {
          errorMessage = 'You are not authorized to create hostels. Please ensure you are logged in as an admin or warden.';
        } else if (err.message.includes('token')) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit && location?.state?.hosteldata) {
      console.log('Editing hostel data:', location.state.hosteldata);
      setFormData(location?.state?.hosteldata);
    }
  }, [isEdit, location?.state]);

  const onNavigateBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <HostelLoader />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', py: 3 }}>
      <Box sx={{ width: '100%', maxWidth: 800 }}>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onNavigateBack}
            sx={{ width: '10%', mr: 2, fontWeight: 'bold', color: 'primary.main', fontSize: '1.3rem' }}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '90%', justifyContent: 'center' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              <HomeIcon />
            </Avatar>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {isEdit ? 'Update Hostel' : 'Add Hostel'}
            </Typography>
          </Box>
        </Box>

        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
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

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Row 1: Hostel Name and Hostel For */}
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                  <TextField
                    required
                    fullWidth
                    id="hostelName"
                    label="Hostel Name"
                    name="hostelName"
                    value={formData.hostelName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <FormControl fullWidth required disabled={isLoading}>
                    <InputLabel id="hostel-for-label">Hostel For</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      label="Hostel For"
                      onChange={handleChange}
                    >
                      <MenuItem value="Boys">Boys</MenuItem>
                      <MenuItem value="Girls">Girls</MenuItem>
                      <MenuItem value="Co-ed">Co-ed</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Row 2: Total Rooms and Students Capacity */}
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                  <TextField
                    required
                    fullWidth
                    id="totalRooms"
                    label="Total No. of Rooms"
                    name="totalRooms"
                    type="number"
                    value={formData.totalRooms > 0 ? formData.totalRooms : 0}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <TextField
                    required
                    fullWidth
                    id="capacity"
                    label="Students Capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity > 0 ? formData.capacity : 0}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </Box>

                {/* Row 3: Warden Selection */}
                <FormControl fullWidth disabled={isLoading}>
                  <InputLabel id="warden-select-label">Warden Name</InputLabel>
                  <Select
                    labelId="warden-select-label"
                    id="warden-select"
                    name="wardenId"
                    value={formData.wardenId}
                    label="Warden Name"
                    onChange={(e: any) => {
                      const selectedWardenId: any = e.target.value;
                      const selectedWarden = wardens.find((w: any) => w?._id === selectedWardenId);
                      setFormData((prev: any) => ({
                        ...prev,
                        wardenId: selectedWardenId,
                        wardenName: selectedWarden?.firstName || ''
                      }));
                    }}
                  >
                    {/* Map through wardens to create menu items */}
                    {wardens?.map((warden: any) => (
                      <MenuItem key={warden._id} value={warden._id}>
                        {warden.firstName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Row 4: Address */}
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                />

                {/* Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    disabled={isLoading}
                    onClick={() => setFormData({
                      hostelName: '',
                      type: '',
                      totalRooms: 0,
                      capacity: 0,
                      wardenId: '',
                      address: '',
                      wardenName: ''
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
                    {isLoading ? 'Adding...' : isEdit ? 'Update Hostel' : 'Add Hostel'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box >
  );
};

export default AddHostel;
