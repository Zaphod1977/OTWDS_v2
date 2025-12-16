import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! Protected content here.</p>
      <button onClick={handleLogout}>Logout</button>  // Added this
    </div>
  );
};

export default AdminDashboard;