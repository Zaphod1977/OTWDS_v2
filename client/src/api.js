import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
if (!backendUrl) {
  console.error('VITE_BACKEND_URL is not set');
}
const api = axios.create({
  baseURL: `${backendUrl}/api`,
});

export default api;