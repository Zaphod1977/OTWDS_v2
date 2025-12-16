import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/admin-login`, { code });
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token); // Store token
        navigate('/admin-dashboard'); // Redirect on success
      } else {
        setError(response.data.message || 'Invalid code');
      }
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"  // Changed to password for hiding input
          placeholder="Enter admin code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AdminLogin;