import React from 'react';
import CategoriesList from './CategoriesList'; // Assuming same folder

const Dashboard = () => {
  return (
    <div>
      <br></br>
      <h2>Categories Page</h2>
      <CategoriesList /> {/* Restores original access */}
    </div>
  );
};

export default Dashboard;