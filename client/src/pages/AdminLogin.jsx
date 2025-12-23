import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button } from '@mui/material';

const AdminLogin = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let backendUrl;

      // LOCAL DEV MODE - Uncomment this block for local testing, comment for hosted deploys
      // backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      // HOSTED/PROD MODE - Uncomment this block for hosted deploys, comment for local testing
      // NOTE: Before deploying to Amplify, ensure this is uncommented and VITE_BACKEND_URL is set in Amplify console
      backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not set in environment variables');
        setError('Configuration error—backend URL not configured. Contact support.');
        return;
      }

      const response = await axios.post(`${backendUrl}/api/auth/admin-login`, { code });
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/dashboard');
        // location.reload();
      } else {
        setError(response.data.message || 'Invalid code');
      }
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 2, bgcolor: '#757575', borderRadius: 2, color: 'white' }}>
      <Typography variant="h5" gutterBottom align="center">
        Admin Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Admin Password"
          type="password"
          variant="filled"
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          sx={{ mb: 2, bgcolor: 'grey', input: { color: 'black' }, label: { color: 'black' } }}
        />
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ bgcolor: '#2196f3' }}>
          {loading ? 'Logging in...' : 'LOGIN'}
        </Button>
      </form>
    </Box>
  );
};

export default AdminLogin;