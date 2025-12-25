import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, Button, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import api from '../api';

const TokenGenerator = () => {
  const [name, setName] = useState('');
  const [timeFrame, setTimeFrame] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => setError('Failed to load categories'));
  }, []);

const handleGenerate = async () => {
  setError('');
  setToken('');
  setCopied(false);
  try {
    const authToken = localStorage.getItem('adminToken');
    if (!authToken) {
      setError('You must be logged in as admin to generate tokens');
      return;
    }
    console.log('Sending authToken:', authToken); // Add this line
    console.log('Authorization header:', `Bearer ${authToken}`); // Add this line
    const response = await api.post('/auth/generate-token', { name, timeFrame, category }, {
      headers: {
        Authorization: `Bearer ${authToken}` // Add this to send the token
      }
    });
    setToken(response.data.token);
  } catch (err) {
    setError(err.response?.data?.message || 'Error generating token');
  }
};


  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2s
  };

  return (
    <Box sx={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <Typography variant="h2" >Token Generator</Typography>
      <TextField 
        label="Service User Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Time Frame</InputLabel>
        <Select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
          <MenuItem value="6hrs">6 Hours</MenuItem>
          <MenuItem value="12hrs">12 Hours</MenuItem>
          <MenuItem value="24hrs">24 Hours</MenuItem>
          <MenuItem value="48hrs">48 Hours</MenuItem>
          <MenuItem value="120hrs">120 Hours</MenuItem>
          <MenuItem value="infinite">Infinite</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => (
            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleGenerate} sx={{ mt: 2 }}>
        Generate
      </Button>
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Generated Token"
          value={token}
          fullWidth
          InputProps={{
            readOnly: true,
            endAdornment: token && (
              <IconButton onClick={handleCopy}>
                <ContentCopyIcon />
              </IconButton>
            ),
          }}
        />
        {copied && <Typography sx={{ ml: 1, color: 'green' }}>Copied!</Typography>}
      </Box>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

export default TokenGenerator;