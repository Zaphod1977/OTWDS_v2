// client/src/pages/TokenDashboard.jsx  (FINAL — CATEGORIES FLOW GUARANTEED)
import { useState, useEffect } from 'react';
import axios from 'axios';

const EXPIRY_OPTIONS = [
  { value: '12h', label: '12 hours' },
  { value: '24h', label: '24 hours' },
  { value: '3d', label: '3 days' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'never', label: 'Never expires (permanent)' },
];

export default function TokenDashboard() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);        // ← NEW: prevents empty dropdown
  const [form, setForm] = useState({ categoryId: '', expiresIn: '7d' });
  const [newToken, setNewToken] = useState(null);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('adminEmail');   // ← NEW
    if (token) {
      setUser({ token, email: savedEmail || 'Supreme Being' });
      fetchData(token);
    }
  }, []);

  const fetchData = async (token) => {
    setLoading(true);
    try {
      console.log("Fetching data with token:", token.substring(0, 20) + "..."); // DEBUG

      const [catRes, tokenRes] = await Promise.all([
        axios.get('http://localhost:5000/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/tokens', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      console.log("Categories loaded:", catRes.data);     // DEBUG
      console.log("Tokens loaded:", tokenRes.data);       // DEBUG

      setCategories(catRes.data);
      setTokens(tokenRes.data);
    } catch (err) {
      console.error("fetchData ERROR:", err.response || err);   // THIS WILL TELL US THE TRUTH
      alert("Data load failed: " + (err.response?.data?.message || err.message));
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email });
      
      // THIS IS THE NUCLEAR FIX
      localStorage.setItem('token', res.data.token);
      setUser({ email, token: res.data.token });
      
      // Force immediate reload of data with the fresh token
      await fetchData(res.data.token);
      setMessage('Welcome, SupremeLord.');
    } catch (err) {
      setMessage('Access denied. SupremeLord or Admin email only.');
    }
  };
  const createToken = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/tokens/create', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewToken(res.data);
      setForm({ ...form, categoryId: '' });
      fetchData(localStorage.getItem('token'));
    } catch (err) {
      alert('Token creation failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const revokeToken = async (id) => {
    if (!window.confirm('Revoke this token forever?')) return;
    await axios.delete(`http://localhost:5000/api/tokens/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchData(localStorage.getItem('token'));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setEmail('');
    setTokens([]);
    setCategories([]);
    setNewToken(null);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh' }}>
      <h1 style={{ color: '#0f0', textAlign: 'center', marginBottom: '40px' }}>
        SUPREME TOKEN CONTROL CENTER
      </h1>

      {!user ? (
        // LOGIN FORM
        <div style={{ maxWidth: '400px', margin: '0 auto', background: '#111', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
          <h2>SupremeLord / Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your sacred email"
              style={{ width: '100%', padding: '15px', fontSize: '18px', marginBottom: '15px', borderRadius: '8px' }}
              required
            />
            <button type="submit" style={{ width: '100%', padding: '15px', fontSize: '18px', background: '#0f0', color: '#000', border: 'none', borderRadius: '8px' }}>
              Enter the Realm
            </button>
          </form>
          {message && <p style={{ marginTop: '20px', color: '#f66' }}>{message}</p>}
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            Logged in as <strong>{email || 'Supreme Being'}</strong> | 
            <button onClick={logout} style={{ marginLeft: '10px', background: 'none', color: '#f66', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
              Logout
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#0f0', fontSize: '24px' }}>
              Loading Supreme Knowledge from the Database...
            </div>
          ) : (
            <>
              {/* CREATE TOKEN FORM */}
              <div style={{ background: '#111', color: '#0f0', padding: '30px', borderRadius: '16px', marginBottom: '40px' }}>
                <h2>Create New Access Token</h2>
                <form onSubmit={createToken} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', alignItems: 'end' }}>
                  <div>
                    <label>Category</label>
                    <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} required style={{ width: '100%', padding: '12px' }}>
                      <option value="">Choose...</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Duration</label>
                    <select value={form.expiresIn} onChange={e => setForm({...form, expiresIn: e.target.value})} style={{ width: '100%', padding: '12px' }}>
                      {EXPIRY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" style={{ padding: '14px 40px', fontSize: '20px', background: '#0f0', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Generate Token
                  </button>
                </form>

                {newToken && (
                  <div style={{ marginTop: '30px', padding: '30px', background: '#000', border: '3px solid #0f0', textAlign: 'center', borderRadius: '16px', fontSize: '32px' }}>
                    <strong>NEW TOKEN:</strong><br/>
                    <span style={{ fontFamily: 'monospace', letterSpacing: '8px', fontSize: '48px' }}>{newToken.token}</span><br/><br/>
                    {newToken.expiresAt ? `Expires: ${new Date(newToken.expiresAt).toLocaleString()}` : 'Never expires'}
                  </div>
                )}
              </div>

              {/* ACTIVE TOKENS LIST */}
              <h2>Active Tokens ({tokens.length})</h2>
              {tokens.length === 0 ? (
                <p>No tokens yet. Create one above!</p>
              ) : (
                tokens.map(t => (
                  <div key={t._id} style={{ background: '#222', padding: '20px', borderRadius: '12px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '28px', fontFamily: 'monospace' }}>{t.token}</strong><br/>
                      Category: <strong>{t.categoryId?.name || '—'}</strong> | 
                      Created: {new Date(t.createdAt).toLocaleDateString()} | 
                      Expires: {t.expiresAt ? new Date(t.expiresAt).toLocaleString() : 'Never'} | 
                      Used by: {t.name || 'Not yet'}
                    </div>
                    <button onClick={() => revokeToken(t._id)} style={{ background: '#f00', color: '#fff', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                      Revoke
                    </button>
                  </div>
                ))
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}