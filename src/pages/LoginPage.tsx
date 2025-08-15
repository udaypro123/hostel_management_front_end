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
    InputAdornment
} from '@mui/material';
import { LockOutlined, Home, Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser } from '../components/auth/api/api';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await loginUser({ email, password });
            if (response.success) {
                console.log("response", response)
                localStorage.setItem("authUser", JSON.stringify(response.user));
                localStorage.setItem("token", response.tokens.accessToken);
                localStorage.setItem("refreshToken", response.tokens.refreshToken);
                enqueueSnackbar('Login successful!', { variant: 'success' });
                navigate('/dashboard');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
            enqueueSnackbar('Login failed. Please try again.', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container component="main" maxWidth="sm" sx={{
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
                        Your digital home away from home
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
                        <LockOutlined sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography component="h2" variant="h5" color="primary.main" fontWeight="bold">
                            Sign In
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
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
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                        </Button>
                        <Box textAlign="center">
                            <Typography variant="body2">
                                Don't have an account?{' '}
                                <Link
                                    to="/signup"
                                    style={{
                                        color: '#1976d2',
                                        textDecoration: 'none',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Sign Up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
