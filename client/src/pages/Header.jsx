import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  if (!token) return null; // Hide header if not logged in

  let userName = 'User'; // Default
  try {
    const decoded = jwtDecode(token);
    userName = decoded.role === 'admin' ? 'Admin' : 'Service User'; // Customize based on role
  } catch (err) {
    // Ignore decode errors
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Logged in as {userName}
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;