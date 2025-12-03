// client/src/api.js  ← ONE FILE TO RULE THEM ALL

import axios from 'axios';

// CHANGE THIS ONE LINE WHEN YOU GO LIVE
const API_BASE = 'https://otwds-api.onrender.com/api';
// For local testing, just change it back to: 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export default api;