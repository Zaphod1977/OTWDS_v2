import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ requiredRole = 'admin' }) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== requiredRole || Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem('adminToken');
      return <Navigate to="/admin-login" replace />;
    }
  } catch (err) {
    localStorage.removeItem('adminToken');
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;