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
} from '@mui/material';
import { ArrowBack, Person as PersonIcon, Save as SaveIcon } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';
import { createDegree, updateDegree } from '../../auth/api/studentApi';



interface DegreeFormData {
  degreeName: string;
  AdmissionYear: Date | null;
  degreeYear: Date | null;
  departmentName: string;
}


const AddDegree: React.FC = () => {
  const location = useLocation();
  const isEdit = location.state?.isEdit || false;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<DegreeFormData>({
    degreeName: '',
    AdmissionYear: null,
    degreeYear: null,
    departmentName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  console.log('Form Data: chenking ', formData);
  console.log('Form Data:', location.state.degreeData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;

    console.log("babskjad", name, value)
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  console.log("formData", formData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.degreeName || !formData.AdmissionYear || !formData.degreeYear || !formData.departmentName) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    let response;
    try {
      response = await createDegree(formData);
      enqueueSnackbar('Degree created successfully!', { variant: 'success' });
      // Reset form
      setFormData({
        degreeName: '',
        AdmissionYear: null,
        degreeYear: null,
        departmentName: '',
      });
      setTimeout(() => {
        navigate('/degrees');
      }, 500);
    } catch (error:any) {
      console.log("response", error)
      const errorMessage = error?.message || 'Something went wrong';
      enqueueSnackbar(`${errorMessage}`, { variant: 'error' });

    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setIsLoading(true);
    try {
      await updateDegree(formData);
      enqueueSnackbar('Degree updated successfully!', { variant: 'success' });
      // Reset form
      setFormData({
        degreeName: '',
        AdmissionYear: null,
        degreeYear: null,
        departmentName: '',
      });
      setTimeout(() => {
        navigate('/degrees');
      }, 500);
    } catch (error) {
      enqueueSnackbar(`Failed to update degree. Please try again`, { variant: 'error' });
      setError('Failed to update degree. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


useEffect(() => {
  if (isEdit && location.state?.degreeData) {
    const degreeData = location.state.degreeData;

    const convertDDMMYYYYtoDate = (str:any) => {
      const [day, month, year] = str.split('/');
      return new Date(`${year}-${month}-${day}`);
    };

    const formatDate = (dateStr:any) => {
      if (!dateStr) return '';
      const d = dateStr.includes('/') ? convertDDMMYYYYtoDate(dateStr) : new Date(dateStr);
      return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
    };

    setFormData({
      ...degreeData,
      degreeYear: formatDate(degreeData.degreeYear),
      AdmissionYear: formatDate(degreeData.AdmissionYear),
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
              {isEdit ? 'Update Degree' : 'Create Degree'}
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
                    id="degreeName"
                    label="Enter Degree Name"
                    name="degreeName"
                    value={formData.degreeName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />

                  <TextField
                    required
                    fullWidth
                    id="AdmissionYear"
                    label="Enter Admission Year"
                    name="AdmissionYear"
                    type="date"
                    value={formData.AdmissionYear ? formData?.AdmissionYear : null}
                    onChange={handleChange}
                    disabled={isLoading}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>

                {/* Row 2: Email and Phone */}
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                  <TextField
                    required
                    fullWidth
                    id="degreeYear"
                    label="Enter Educational Year"
                    name="degreeYear"
                    type="date"
                    value={formData.degreeYear ? formData.degreeYear : null}
                    onChange={handleChange}
                    disabled={isLoading}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    required
                    fullWidth
                    id="departmentName"
                    label="Enter Department Name"
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />

                </Box>

                {/* Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    disabled={isLoading}
                    onClick={() => setFormData({
                      degreeName: '',
                      AdmissionYear: null,
                      degreeYear: null,
                      departmentName: '',
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
                    {isLoading ? 'Adding...' : isEdit ? 'Update Degree' : 'Add Degree'}
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

export default AddDegree;
