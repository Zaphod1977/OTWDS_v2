// client/src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email });
      localStorage.setItem('token', res.data.token);
      setMessage('Logged in! Token saved.');
      // optional: redirect somewhere
      // window.location.href = '/';
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ padding: '100px', fontFamily: 'sans-serif' }}>
      <h1>SupremeLord / Admin Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your hard-coded email"
          style={{ width: '300px', padding: '10px', fontSize: '16px' }}
          required
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Login
        </button>
      </form>
      <p>{message}</p>
      {localStorage.getItem('token') && (
        <div style={{ marginTop: '20px', background: '#222', color: '#0f0', padding: '10px', wordBreak: 'break-all' }}>
          <strong>Your JWT (copy this for Postman):</strong><br />
          {localStorage.getItem('token')}
        </div>
      )}
    </div>
  );
}