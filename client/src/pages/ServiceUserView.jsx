// client/src/pages/ServiceUserView.jsx  ← FINAL — THIS ONE WORKS 100%
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CategoryPage from './CategoryPage';

export default function ServiceUserView() {
  const [tokenInput, setTokenInput] = useState('');
  const [step, setStep] = useState('enter');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  // Auto-fill from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setTokenInput(urlToken);
      handleTokenSubmit(urlToken);
    }
  }, []);

  const handleTokenSubmit = async (input = tokenInput) => {
    if (!input.trim()) return;
    setMessage('Validating...');

    const token = input.toUpperCase().replace('BEARER ', '').trim();

    try {
      const res = await axios.post('http://localhost:5000/api/service/login', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.data.user?.name) {
        setTokenInput(token);
        setStep('identity');
        setMessage('');
      } else {
        setCategory(res.data.category);
        setUserInfo(res.data.user);
        setStep('main');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid token');
    }
  };

  const handleIdentitySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const res = await axios.post('http://localhost:5000/api/service/login', data, {
        headers: { Authorization: `Bearer ${tokenInput}` }
      });

      setCategory(res.data.category);
      setUserInfo(res.data.user);
      setStep('main');
      navigate(`/category/${res.data.category._id}`);   // ← THIS TAKES THEM TO THEIR CATEGORY
      setStep('main');
    } catch (err) {
      setMessage('Save failed');
    }
  };

  // TOKEN ENTRY
  if (step === 'enter') {
    return (
      <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center', fontFamily: 'system-ui' }}>
        <h1 style={{ color: '#0f0', fontSize: '42px' }}>SERVICE ACCESS PORTAL</h1>
        <p>Type your token (with or without "Bearer")</p>
        <form onSubmit={(e) => { e.preventDefault(); handleTokenSubmit(); }}>
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="91446953A or Bearer 91446953A"
            style={{
              width: '100%',
              padding: '25px',
              fontSize: '28px',
              textAlign: 'center',
              fontFamily: 'monospace',
              border: '3px solid #0f0',
              borderRadius: '12px',
              background: '#000',
              color: '#0f0'
            }}
            required
          />
          <button style={{
            marginTop: '30px',
            padding: '18px 80px',
            fontSize: '28px',
            background: '#0f0',
            color: '#000',
            border: 'none',
            borderRadius: '12px',
          }}>
            ENTER
          </button>
        </form>
        {message && <p style={{ marginTop: '20px', color: '#f66', fontSize: '20px' }}>{message}</p>}
      </div>
    );
  }

  // FIRST-TIME SETUP
  if (step === 'identity') {
    return (
      <div style={{ maxWidth: '500px', margin: '100px auto', textAlign: 'center' }}>
        <h1 style={{ color: '#0f0' }}>First-Time Setup</h1>
        <form onSubmit={handleIdentitySubmit}>
          <input name="name" placeholder="Full Name" required style={{ width: '100%', padding: '15px', margin: '10px 0', fontSize: '18px' }} />
          <input name="phone" placeholder="Phone (optional)" style={{ width: '100%', padding: '15px', margin: '10px 0', fontSize: '18px' }} />
          <input name="company" placeholder="Company (optional)" style={{ width: '100%', padding: '15px', margin: '10px 0', fontSize: '18px' }} />
          <button style={{ width: '100%', padding: '18px', background: '#0f0', color: '#000', fontSize: '20px', marginTop: '20px' }}>
            SAVE & ENTER
          </button>
        </form>
      </div>
    );
  }

  // MAIN VIEW — THE FINAL LINE
  return (
    <div>
      {typeof window !== 'undefined' && (window.currentServiceToken = tokenInput)}
      {/* THIS IS THE KEY — PASS THE TOKEN */}
      <CategoryPage
        forcedCategoryId={category._id}
        serviceToken={tokenInput}   // ← THIS LINE MUST BE HERE
        serviceUserName={userInfo?.name}
      />    </div>
  );
}