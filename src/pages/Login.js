import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Avatar
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Google,
  Facebook
} from '@mui/icons-material';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData);
      const response = await axios.post('http://localhost:8000/api/auth.php?action=login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      console.log('Login response:', response.data);

      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/');
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error details:', error);

      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        const errorMessage = error.response.data?.message;
        if (errorMessage) {
          setError(errorMessage);
        } else {
          setError(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        // Network error
        console.error('Network error - no response received');
        setError('Cannot connect to server. Please check if backend is running on port 8000.');
      } else {
        // Other error
        console.error('Request setup error:', error.message);
        setError('Request failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Implement social login logic here
    console.log(`Login with ${provider}`);
  };

  return (
    <Container component="main" maxWidth="sm" className="py-8">
      <Paper elevation={3} className="p-8">
        {/* Header */}
        <Box className="text-center mb-8">
          <Avatar className="mx-auto mb-4 bg-primary-500 w-16 h-16">
            <Lock className="w-8 h-8" />
          </Avatar>
          <Typography component="h1" variant="h4" className="font-bold text-gray-900 mb-2">
            Welcome Back
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Sign in to your account to continue shopping
          </Typography>
        </Box>

        {/* Social Login Buttons */}
        <Box className="mb-6">
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={() => handleSocialLogin('google')}
            className="mb-3 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Continue with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Facebook />}
            onClick={() => handleSocialLogin('facebook')}
            className="py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Continue with Facebook
          </Button>
        </Box>

        <Divider className="my-6">
          <Typography variant="body2" className="text-gray-500 px-2">
            or continue with email
          </Typography>
        </Divider>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit} className="space-y-6">
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email className="text-gray-400" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            className="mb-4"
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock className="text-gray-400" />
                </InputAdornment>
              ),
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
            variant="outlined"
            className="mb-4"
          />

          <Box className="flex items-center justify-between mb-6">
            <Link
              to="/forgot-password"
              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              Forgot your password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            className="py-3 text-lg font-medium"
            style={{ backgroundColor: '#3b82f6', color: 'white' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Test Connection Button */}
          <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={async () => {
              try {
                const response = await axios.get('http://localhost:8000/api/auth.php?action=test');
                console.log('Backend test response:', response.data);
                alert('Backend connection successful! Check console for details.');
              } catch (error) {
                console.error('Backend test error:', error);
                alert('Backend connection failed! Check console for details.');
              }
            }}
            className="mt-3 py-2"
            style={{ borderColor: '#10b981', color: '#10b981' }}
          >
            Test Backend Connection
          </Button>
        </Box>

        {/* Sign Up Link */}
        <Box className="text-center mt-6">
          <Typography variant="body1" className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Sign up now
            </Link>
          </Typography>
        </Box>

        {/* Demo Credentials */}
        <Box className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Typography variant="h6" className="text-blue-800 mb-2 font-medium">
            Demo Credentials
          </Typography>
          <Typography variant="body2" className="text-blue-700 mb-1">
            <strong>Admin:</strong> admin@example.com / password
          </Typography>
          <Typography variant="body2" className="text-blue-700">
            <strong>User:</strong> john@example.com / password
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
