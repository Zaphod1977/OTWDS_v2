import React from 'react';
import { Container, Typography, Box, Grid, TextField, Button } from '@mui/material';
import AdminLogin from './AdminLogin';
import ServiceLogin from './ServiceLogin'; // New form component (create next)

import houseImg from '../assets/images/Girl20the20eardrum.jpg';

const LandingPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
      {/* Client Info Section */}
      <Typography variant="h3" color="primary" fontWeight="bold" gutterBottom>
        Bridges Residence
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1">
          802 West 6th St,
          <br />
          Staunton IL 62088
        </Typography>
        <Typography variant="body1">
          Phone: (314) 853-0016
        </Typography>
        <Typography variant="body1">
          Email: carfiguru@gmail.com
        </Typography>
      </Box>

      {/* Image Section */}
      <Box sx={{ mb: 4 }}>
        <img
          src={houseImg}
          alt="Asset Image"
          style={{ width: '100%', maxWidth: '800px', borderRadius: '8px' }}
        />
      </Box>

      {/* Asset Details Section */}
      <Grid container spacing={2} justifyContent="center">
        <Grid sx={{ xs: 6, sm: 3 }}>
          <Typography variant="h6" fontWeight="bold">Square Footage</Typography>
          <Typography variant="body1">2,500 sqft</Typography>
        </Grid>
        <Grid sx={{ xs: 6, sm: 3 }}>
          <Typography variant="h6" fontWeight="bold">Bedrooms</Typography>
          <Typography variant="body1">4 beds</Typography>
        </Grid>
        <Grid sx={{ xs: 6, sm: 3 }}>
          <Typography variant="h6" fontWeight="bold">Acres</Typography>
          <Typography variant="body1">1.5 acres</Typography>
        </Grid>
        <Grid sx={{ xs: 6, sm: 3 }}>
          <Typography variant="h6" fontWeight="bold">Bathrooms</Typography>
          <Typography variant="body1">3 baths</Typography>
        </Grid>
      </Grid>
      <br></br>
      <br></br>

      {/* Admin Login Form */}
      <Box sx={{ mt: 6, maxWidth: '400px', margin: 'auto' }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        </Typography>
        <AdminLogin />
      </Box>

      {/* Service User Login Form - Styled the same as admin */}
      <Box sx={{ mt: 4, maxWidth: '400px', margin: 'auto' }}>
        <ServiceLogin />
      </Box>
    </Container>
  );
};

export default LandingPage;