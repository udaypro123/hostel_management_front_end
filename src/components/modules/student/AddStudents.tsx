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
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from '@mui/material';
import { ArrowBack, Person as PersonIcon, Save as SaveIcon } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllRooms, getHostels } from '../../auth/api/hostelApi';
import { AddStudents, getAllDegrees, updateStudents } from '../../auth/api/studentApi';

const AddStudent: React.FC = () => {
  const location = useLocation();
  const isEdit = location.state?.isEdit || false;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: Date || null,
    email: '',
    phone: '',
    address: '',
    hostelId: '',
    roomId: '',
    enrolledDegree: '',
    joiningDate: Date || null,
    gender: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hostels, setHostels] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  // const [selectedHostel, setSelectedHostel] = useState('');
  // const [selectedRoom, setSelectedRoom] = useState('');
  const paginationModel = { page: 0, pageSize: 100 }
  const [degrees, setDegrees] = useState<any[]>([]);
  const [error, setError] = useState('');
  console.log('Form Data:', formData);
  console.log('Form Data:', location.state.studentData);


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

  const fetAllDegrees = async (page: number, pageSize: number) => {
    try {
      setIsLoading(true);
      console.log('Fetching rooms with pagination:', { page, pageSize });
      const response = await getAllDegrees(page, pageSize);
      console.log('Fetched degrees:', response.data);
      let objdata: any = []
      response?.data?.map((degree: any) => {
        let obj = {
          _id: degree?._id,
          degreeName: degree?.degreeName,
          AdmissionYear: degree?.AdmissionYear ? new Date(degree?.AdmissionYear)?.toLocaleDateString() : null,
          degreeYear: degree?.degreeYear ? new Date(degree?.degreeYear)?.toLocaleDateString() : null,
          departmentName: degree?.departmentName,
        };
        objdata.push(obj);
      });
      console.log('Processed rooms data:', objdata);
      setDegrees(objdata);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetAllDegrees(paginationModel.page, paginationModel.pageSize);
  }, []);

  const fetchRooms = async (page: number, pageSize: number) => {
    try {
      setIsLoading(true);
      console.log('Fetching rooms with pagination:', { page, pageSize });
      const response = await getAllRooms(page, pageSize);
      console.log('Fetched rooms:', response.data);
      let objdata: any = []
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(paginationModel.page, paginationModel.pageSize);
  }, []);

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

  console.log("formdatat", formData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.dob || !formData.email || !formData.phone || !formData?.hostelId || !formData?.roomId || !formData?.enrolledDegree || !formData?.address || !formData.joiningDate) {
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

    // Enrolled Degree validation (if provided)
    setIsLoading(true);
    let response;
    try {
      response = await AddStudents(formData);
      enqueueSnackbar('Student added successfully!', { variant: 'success' });
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        dob: Date || null,
        email: '',
        phone: '',
        address: '',
        hostelId: '',
        roomId: '',
        enrolledDegree: '',
        joiningDate: Date || null,
        gender: ""
      });

      console.log("response", response)
      navigate('/students');
    } catch (error:any) {
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
      await updateStudents(formData);
      enqueueSnackbar('Student updated successfully!', { variant: 'success' });
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        dob: Date || null,
        email: '',
        phone: '',
        address: '',
        hostelId: '',
        roomId: '',
        enrolledDegree: '',
        joiningDate: Date || null,
        gender: ""
      });
      navigate('/students');
    } catch (error) {
      enqueueSnackbar(`Failed to update student. Please try again`, { variant: 'error' });
      setError('Failed to update student. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit && location.state?.studentData) {
      // setFormData(location.state.studentData);
      const studentData = location.state.studentData;

      const convertDDMMYYYYtoDate = (str: any) => {
        const [day, month, year] = str.split('/');
        return new Date(`${year}-${month}-${day}`);
      };

      const formatDate = (dateStr: any) => {
        if (!dateStr) return '';
        const d = dateStr.includes('/') ? convertDDMMYYYYtoDate(dateStr) : new Date(dateStr);
        return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
      };

      setFormData({
        ...studentData,
        dob: formatDate(studentData.dob),
        joiningDate: formatDate(studentData.joiningDate),
      });
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
              {isEdit ? 'Update Student' : 'Add New Student'}
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
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                  <TextField
                    required
                    fullWidth
                    id="dob"
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    disabled={isLoading}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
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
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                  <FormControl fullWidth>
                    <InputLabel id="hostel-label"> Select Hostel</InputLabel>
                    <Select
                      labelId="hostel-label"
                      id="hostelId"
                      name="hostelId"
                      value={formData?.hostelId}
                      label="Hostel Assignment"
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      {hostels.map((hostel: any) => (
                        <MenuItem key={hostel?._id} value={hostel?._id}>
                          {hostel?.hostelName}
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
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                  <FormControl fullWidth>
                    <InputLabel id="room-label"> Select Room</InputLabel>
                    <Select
                      labelId="room-label"
                      id="roomId"
                      name="roomId"
                      value={formData?.roomId}
                      label="Select Room"
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      {rooms.map((room: any) => (
                        <MenuItem key={room?._id} value={room?._id}>
                          {room?.roomNumber}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="degree-label"> Select Degree</InputLabel>
                    <Select
                      labelId="degree-label"
                      id="enrolledDegree"
                      name="enrolledDegree"
                      value={formData?.enrolledDegree}
                      label="Select Degree"
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      {degrees.map((degree: any, index: any) => (
                        <MenuItem key={index} value={degree?._id}>
                          {degree?.degreeName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

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
                      dob: Date || null,
                      email: '',
                      phone: '',
                      address: '',
                      hostelId: '',
                      roomId: '',
                      enrolledDegree: '',
                      joiningDate: Date || null,
                      gender: ""
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
                    {isLoading ? 'Adding...' : isEdit ? 'Update Student' : 'Add Student'}
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

export default AddStudent;
