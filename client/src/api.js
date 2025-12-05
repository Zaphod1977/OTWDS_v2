// client/src/api.js  ← FINAL VERSION — WORKS FOR SERVICE TOKENS
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// THIS INTERCEPTOR FIXES EVERYTHING
api.interceptors.request.use((config) => {
  // Service token from ServiceUserView has priority
  if (window.currentServiceToken) {
    config.headers.Authorization = `Bearer ${window.currentServiceToken}`;
  } 
  // Otherwise fall back to normal admin JWT
  else {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;