import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, Alert, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material'; // Updated imports
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext'; // Adjust path as needed

const ServiceLogin = () => {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false); // State for details modal
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.post(`${backendUrl}/api/auth/validate-token`, { token });
      if (response.data.success) {
        setDetailsOpen(true); // Open details modal
      } else {
        setError('Invalid token. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleDetailsSubmit = async () => {
    setError('');
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.post(`${backendUrl}/api/auth/service-login`, { token, name, company, phone, email });
      if (response.data.success) {
        login(response.data.token, response.data.user); // Store in context/localStorage
        setDetailsOpen(false);
        navigate('/dashboard');
      } else {
        setError('Error saving details. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Service User Login
      </Typography>
      <IconButton onClick={() => setOpenModal(true)} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <InfoIcon />
      </IconButton>
      <form onSubmit={handleTokenSubmit}>
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
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
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
      </Dialog>

      {/* Details Modal */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <DialogTitle>Enter Your Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Cancel</Button>
          <Button onClick={handleDetailsSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceLogin;