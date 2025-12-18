import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, Alert, Modal, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext'; // Adjust path as needed

const ServiceLogin = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const { login } = useContext(AuthContext); // Assuming login function sets token/user in context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/auth/service-login', { token });
      const { token: authToken, user } = response.data; // Expect JWT and user details
      login(authToken, user); // Store in context/localStorage
      navigate('/dashboard'); // Redirect to categories/dashboard
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid token. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Service User Login
      </Typography>
      <IconButton onClick={() => setOpenModal(true)} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <InfoIcon />
      </IconButton>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Access Token"
          variant="outlined"
          fullWidth
          value={token}
          onChange={(e) => setToken(e.target.value)}
          sx={{ mb: 2 }}
        />
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Button type="submit" variant="contained" fullWidth>
          Login
        </Button>
      </form>

      {/* Info Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
          <IconButton onClick={() => setOpenModal(false)} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            About Service Tokens
          </Typography>
          <Typography>
            Enter the token provided by your admin. It grants limited access to specific categories for viewing and adding entries. Tokens expire after a set time—contact your admin for a new one if needed.
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default ServiceLogin;