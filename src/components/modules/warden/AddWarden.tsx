import React, { use, useEffect, useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ArrowBack, Person as PersonIcon, Save as SaveIcon } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';
import { createWarden, updateWarden } from '../../auth/api/wardenApi';

const AddWarden: React.FC = () => {
  const location = useLocation();
  const isEdit = location.state?.isedit || false;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    hostelAssigned: '',
    experience: '',
    qualification: '',
    emergencyContact: '',
    joiningDate: '',
    gender:""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  console.log('Form Data:', formData);
  console.log('Form Data:', location.state.wardenData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;

    // Validation for phone number - only allow digits and max 10 characters
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, ''); // Remove non-digits
      if (phoneValue.length <= 10) {
        setFormData(prev => ({
          ...prev,
          [name]: phoneValue
        }));
      }
      return;
    }

    // Validation for emergency contact - only allow digits and max 10 characters
    if (name === 'emergencyContact') {
      const phoneValue = value.replace(/\D/g, ''); // Remove non-digits
      if (phoneValue.length <= 10) {
        setFormData(prev => ({
          ...prev,
          [name]: phoneValue
        }));
      }
      return;
    }

    // Validation for experience - only allow numbers
    if (name === 'experience') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-digits
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Phone validation
    if (formData.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    // Experience validation (if provided)
    if (formData.experience && (isNaN(Number(formData.experience)) || Number(formData.experience) < 0)) {
      setError('Experience must be a valid positive number');
      return;
    }

    setIsLoading(true);
    let response;
    try {
      response = await createWarden(formData);
      enqueueSnackbar('Warden added successfully!', { variant: 'success' });
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        hostelAssigned: '',
        experience: '',
        qualification: '',
        emergencyContact: '',
        joiningDate: '',
        gender:"",
      });
      navigate('/wardens');
    } catch (error) {
      console.error('Error adding warden:', error.response.data);
      enqueueSnackbar(`${error.response.data.message}. Please try again`, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Phone validation
    if (formData.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return;
    }
    setIsLoading(true);
    try {
      await updateWarden(formData);
      enqueueSnackbar('Warden updated successfully!', { variant: 'success' });
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        hostelAssigned: '',
        experience: '',
        qualification: '',
        emergencyContact: '',
        joiningDate: '',
        gender:"",
      });
      navigate('/wardens');
    } catch (error) {
      enqueueSnackbar(`Failed to update warden. Please try again`, { variant: 'error' });
      setError('Failed to update warden. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit && location.state?.wardenData) {
      setFormData(location.state.wardenData);
    }
  }, [isEdit, location.state]);

  const onNavigateBack = () => {
    window.history.back();
  };

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
              <PersonIcon />
            </Avatar>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {isEdit ? 'Update Warden' : 'Add New Warden'}
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
            <Box component="form" onSubmit={isEdit ? handleUpdate : handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Section: Personal Information */}
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  Personal Information
                </Typography>

                {/* Row 1: First Name and Last Name */}
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </Box>

                {/* Row 2: Email and Phone */}
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <TextField
                    required
                    fullWidth
                    id="phone"
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                    inputProps={{
                      maxLength: 10,
                      pattern: "[0-9]*",
                      inputMode: "numeric"
                    }}
                    helperText="Enter 10-digit phone number"
                  />
                </Box>

                {/* Row 3: Address */}
                <TextField
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

                {/* Section: Professional Information */}
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  Professional Information
                </Typography>

                {/* Row 4: Hostel Assignment and Joining Date */}
                {/* <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                  <FormControl fullWidth>
                    <InputLabel id="hostel-label">Hostel Assignment</InputLabel>
                    <Select
                      labelId="hostel-label"
                      id="hostelAssigned"
                      name="hostelAssigned"
                      value={formData.hostelAssigned}
                      label="Hostel Assignment"
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      {hostels.map((hostel, index) => (
                        <MenuItem key={index} value={hostel}>
                          {hostel}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    id="joiningDate"
                    label="Joining Date"
                    name="joiningDate"
                    type="date"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    disabled={isLoading}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box> */}

                {/* Row 5: Experience and Qualification */}
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                  <TextField
                    fullWidth
                    id="experience"
                    label="Years of Experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={isLoading}
                    inputProps={{
                      pattern: "[0-9]*",
                      inputMode: "numeric"
                    }}
                    helperText="Enter years of experience (numbers only)"
                  />
                  <TextField
                    fullWidth
                    id="qualification"
                    label="Highest Qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </Box>

                {/* Row 6: Emergency Contact */}
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                  <FormControl fullWidth>
                    <InputLabel id="gender-label">Select Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      label="Select Gender"
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      {['male', 'female', 'other'].map((hostel, index) => (
                        <MenuItem key={index} value={hostel}>
                          {hostel}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    id="emergencyContact"
                    label="Emergency Contact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    disabled={isLoading}
                    inputProps={{
                      maxLength: 10,
                      pattern: "[0-9]*",
                      inputMode: "numeric"
                    }}
                    helperText="Enter 10-digit emergency contact number"
                  />
                </Box>


                {/* Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    disabled={isLoading}
                    onClick={() => setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      address: '',
                      hostelAssigned: '',
                      experience: '',
                      qualification: '',
                      emergencyContact: '',
                      joiningDate: '',
                      gender:""
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
                    {isLoading ? 'Adding...' : isEdit ? 'Update Warden' : 'Add Warden'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AddWarden;
