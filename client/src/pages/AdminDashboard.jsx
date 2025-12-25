import React from 'react';
import CategoriesList from './CategoriesList'; // Assuming same folder
import { Typography } from '@mui/material';


const Dashboard = () => {
  return (
    <div>
        <br></br>
        <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
          Categories Page
        </Typography>
        <CategoriesList /> {/* Restores original access */}
    </div>
  );
};

export default Dashboard;