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
  Chip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ArrowBack, MeetingRoom as RoomIcon, Save as SaveIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { addRoomToHostel, getHostels, updateRoomsToHostel } from '../../auth/api/hostelApi';
import { HostelLoader } from '../../../utils/hostelLoader';

const AddRoom: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roomNumber: '',
    hostelId: '',
    floor: 0,
    occupancy: '',
    capacity: 0,
    rent: 0,
    facilities: [] as string[],
    description: '',
    status: 'available'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [hostels, setHostels] = useState<any[]>([]);
  const { isEdit , roomdata } = useLocation().state || { isEdit: false };

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

  const availableFacilities = [
    'WiFi',
    'Air Conditioning',
    'Attached Bathroom',
    'Study Table',
    'Wardrobe',
    'Balcony',
    'Common Room Access',
    'Laundry',
    'Hot Water'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFacilityToggle = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev?.facilities?.includes(facility)
        ? prev.facilities.filter((f: any) => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData?.roomNumber || !formData?.hostelId || !formData?.occupancy || !formData?.capacity) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      
      let hostelId:any = formData.hostelId;
      let room:any ={
        roomNumber: formData.roomNumber,
        hostelId,
        floor: formData.floor,
        occupancy: formData.occupancy,
        capacity: Number(formData.capacity) || 0,
        rent: Number(formData.rent) || 0,
        facilities: formData.facilities,
        description: formData.description,
        status: formData.status
      };
      if (isEdit && roomdata) {
        room._id = roomdata._id; // Include ID for editing
      } 
      if( isEdit && roomdata) {
        await updateRoomsToHostel({room, hostelId});
        setSuccess('Room updated successfully!');
        enqueueSnackbar('Room updated successfully!', { variant: 'success' });
        navigate('/rooms'); // Redirect to rooms page after update
      }else{
        await addRoomToHostel({room, hostelId});
        setSuccess('Room added successfully!');
        enqueueSnackbar('Room added successfully!', { variant: 'success' });
        navigate('/rooms'); // Redirect to rooms page after addition
      }

      // Reset form
      setFormData({
        roomNumber: '',
        hostelId: '',
        floor: 0,
        occupancy: '',
        capacity: 0,
        rent: 0,
        facilities: [],
        description: '',
        status: 'available'
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
    if (isEdit && roomdata) {
      setFormData({
        roomNumber: roomdata.roomNumber || '',
        hostelId: roomdata.hostelId || '',
        floor: roomdata.floor || 0,
        occupancy: roomdata.occupancy || '',
        capacity: roomdata.capacity || 0,
        rent: roomdata.rent || 0,
        facilities: roomdata.facilities || [],
        description: roomdata.description || '',
        status: roomdata.status || 'available'
      });
    }
  }, [isEdit, roomdata]);

  console.log('Form Data:', formData);
  console.log('Room Data:', roomdata);

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
           {isEdit ? `Edit Room ` : 'Add New Room'}
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
        <Grid container spacing={3} sx={{width: '100%'}}>
          <Box sx={{ width: "48%" }} >
            <TextField
              fullWidth
              id="roomNumber"
              label="Room Number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Box>

          <Box sx={{ width: "48%" }} >
            <FormControl fullWidth required>
              <InputLabel id="hostel-label">Hostel</InputLabel>
              <Select
                labelId="hostel-label"
                id="hostel"
                name="hostelId"
                value={formData.hostelId}
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
              id="floor"
              label="Floor"
              name="floor"
              type="number"
              value={formData.floor}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Box>

          <Box sx={{ width: "48%" }}>
            <FormControl fullWidth required>
              <InputLabel id="occupancy-label">Occupancy</InputLabel>
              <Select
                labelId="occupancy-label"
                id="occupancy"
                name="occupancy"
                value={formData?.occupancy}
                label="Occupancy"
                onChange={(e: any) => handleChange(e)}
                disabled={isLoading}
              >
                <MenuItem value={1}>Single Occupancy</MenuItem>
                <MenuItem value={2}>Double Occupancy</MenuItem>
                <MenuItem value={3}>Triple Occupancy</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ width: "48%" }}>
            <TextField
              required
              fullWidth
              id="capacity"
              label="Capacity"
              name="capacity"
              type="number"
              value={formData.capacity > 0 ? formData.capacity : 0}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Box>

          <Box sx={{ width: "48%" }}>
            <TextField
              fullWidth
              id="rent"
              label="Monthly Rent (₹)"
              name="rent"
              type="number"
              value={formData.rent}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Box>

          <Box sx={{ width: "48%" }}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status}
                label="Status"
                onChange={(e: any) => handleChange(e)}
                disabled={isLoading}
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="occupied">Occupied</MenuItem>
                <MenuItem value="maintenance">Under Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ width: "98%" }}>
            <TextField
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Additional details about the room..."
            />
          </Box>

          <Box >
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Facilities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableFacilities.map((facility) => (
                <Chip
                  key={facility}
                  label={facility}
                  clickable
                  color={formData.facilities.includes(facility) ? 'primary' : 'default'}
                  onClick={() => handleFacilityToggle(facility)}
                  variant={formData.facilities.includes(facility) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>



          <Box sx={{ width: "96%" }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', width: '100%', }}>
              <Button
                type="button"
                variant="outlined"
                disabled={isLoading}
                onClick={() => setFormData({
                  roomNumber: '',
                  hostelId: '',
                  floor: 0,
                  occupancy: '',
                  capacity: 0,
                  rent: 0,
                  facilities: [],
                  description: '',
                  status: 'available'
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
                {isLoading ? 'Adding...' : isEdit ? "Update Room" : 'Add Room'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default AddRoom;
