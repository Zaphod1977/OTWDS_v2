import React from 'react';
import { Container, Typography, Box, Grid, TextField, Button } from '@mui/material';
import AdminLogin from './AdminLogin';
import ServiceLogin from './ServiceLogin';

import houseImg from '../assets/images/house.jpg';

const LandingPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
      {/* Client Info Section */}
      <Typography variant="h3" color="Black" fontWeight="bold" gutterBottom>
        Bridges Residence
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1">
          2987 West 6th St,
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
        <img className='landingimage'
          src={houseImg}
          alt="Asset Image"
          style={{ width: '100%', maxWidth: '800px', borderRadius: '8px' }}
        />
      </Box>

      {/* Asset Details Section */}
      <Grid container spacing={2} justifyContent="center">
        <Grid sx={{ xs: 6, sm: 3 }}>
          <Typography variant="h6" fontWeight="bold">Square Footage</Typography>
          <Typography variant="body1">1,500 sqft</Typography>
        </Grid>
        <Grid sx={{ xs: 6, sm: 3 }}>
          <Typography variant="h6" fontWeight="bold">Bedrooms</Typography>
          <Typography variant="body1">2 beds</Typography>
        </Grid>
        <Grid sx={{ xs: 6, sm: 3 }}>
          <Typography variant="h6" fontWeight="bold">Bathrooms</Typography>
          <Typography variant="body1">2 baths</Typography>
        </Grid>
        <Grid sx={{ xs: 6, sm: 3 }}>
          <Typography variant="h6" fontWeight="bold">Acres</Typography>
          <Typography variant="body1">1.5 acres</Typography>
        </Grid>
        <Grid sx={{ xs: 6, sm: 3 }}>
          <Typography variant="h6" fontWeight="bold">Garage</Typography>
          <Typography variant="body1">Attached</Typography>
        </Grid>

      </Grid>
      <br></br>
      <br></br>

      {/* Admin Login Form */}
      <Grid container spacing={8} justifyContent="center">
        <Box sx={{ mt: 6, maxWidth: '400px', margin: '1rem' }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
          </Typography>
          <AdminLogin />
        </Box>

        {/* Service User Login Form */}
        <Box sx={{ mt: 6, maxWidth: '400px', margin: '1.55rem 2rem' }}>
          <ServiceLogin />
        </Box>
      </Grid>
    </Container>
  );
};

export default LandingPage;