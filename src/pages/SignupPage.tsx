import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment,
    MenuItem
} from '@mui/material';
import { PersonAdd, Home, Visibility, VisibilityOff } from '@mui/icons-material';
import { registerUser } from '../components/auth/api/api';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

export default function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        role: 'student',
        dateOfBirth: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const { confirmPassword, ...registrationData } = formData;
            const response = await registerUser(registrationData);
            
            if (response.success) {
                enqueueSnackbar('Registration successful! Please login.', { variant: 'success' });
                navigate('/login');
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
            enqueueSnackbar('Registration failed. Please try again.', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="md" sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center',
            py: 3
        }}>
            <Paper elevation={8} sx={{ 
                p: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                width: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    flexDirection: 'column'
                }}>
                    <Home sx={{ fontSize: 40, mb: 1, color: '#FFD700' }} />
                    <Typography component="h1" variant="h4" fontWeight="bold" textAlign="center">
                        Hostel Management
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                        Join our community today
                    </Typography>
                </Box>

                <Box sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    p: 4, 
                    borderRadius: 2, 
                    width: '100%',
                    color: 'text.primary'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
                        <PersonAdd sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography component="h2" variant="h5" color="primary.main" fontWeight="bold">
                            Create Account
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
                            <TextField
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                name="firstName"
                                autoComplete="given-name"
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
                                autoComplete="family-name"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </Box>

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
                            <TextField
                                required
                                fullWidth
                                id="phoneNumber"
                                label="Phone Number"
                                name="phoneNumber"
                                autoComplete="tel"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <TextField
                                required
                                fullWidth
                                select
                                id="role"
                                label="Role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                disabled={isLoading}
                            >
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="warden">Warden</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </TextField>
                        </Box>

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="dateOfBirth"
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            disabled={isLoading}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 2 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 3, 
                                mb: 2, 
                                py: 1.5,
                                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                fontWeight: 'bold'
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                        </Button>

                        <Box textAlign="center">
                            <Typography variant="body2">
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    style={{ 
                                        color: '#1976d2', 
                                        textDecoration: 'none',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
