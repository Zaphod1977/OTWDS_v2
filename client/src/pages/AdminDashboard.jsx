import React from 'react';
import CategoriesList from './CategoriesList'; // Assuming same folder

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome back! Here's your categories:</p>
      <CategoriesList /> {/* Restores original access */}
    </div>
  );
};

export default Dashboard;