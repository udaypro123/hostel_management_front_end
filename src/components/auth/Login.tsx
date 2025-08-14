import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Link,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment
} from '@mui/material';
import { LockOutlined, Home, Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser } from './api/api';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

interface LoginProps {
    onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        let objectToSend = {
            email,
            password
        };
        
        try {
            const success = await loginUser(objectToSend);
            console.log('Login success:', success);
            
            // Store both user data and token
            localStorage.setItem("authUser", JSON.stringify(success.user));
            localStorage.setItem("token", success.tokens.accessToken);
            localStorage.setItem("refreshToken", success.tokens.refreshToken);
            
            if (!success) {
                setError('Invalid email or password');
            }
            else {
                // Redirect to dashboard or home page after successful login
                navigate('/dashboard');
            }
        } catch (error) {
            enqueueSnackbar('Email or Password is incorrect', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: { xs: 2, sm: 0 },
        }}>
            <Paper
                elevation={8}
                sx={{
                    width: '90%',
                    height: '70vh',
                    p: { xs: 3, sm: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        color: 'primary.main'
                    }}
                >
                    <Home sx={{ fontSize: 30, mr: 1 }} />
                    <Typography component="h1" variant="h4" fontWeight="bold">
                        Hostel Management
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        p: 2,
                        backgroundColor: 'primary.main',
                        borderRadius: '50%'
                    }}
                >
                    <LockOutlined sx={{ fontSize: 30, color: 'white' }} />
                </Box>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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
                        sx={{ mb: 3 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
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
                        disabled={isLoading}
                        sx={{
                            py: 1.5,
                            mb: 2,
                            fontSize: '1.1rem',
                            textTransform: 'none'
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Sign In'
                        )}
                    </Button>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                            Forgot password ?
                        </Link>
                        <Link
                            component="button"
                            type="button"
                            variant="body2"
                            onClick={onSwitchToSignup}
                            sx={{ textDecoration: 'none', marginLeft: 1 }}
                        >
                            Don't have an account? Sign Up
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
