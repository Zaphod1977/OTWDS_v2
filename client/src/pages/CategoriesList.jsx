// client/src/pages/CategoriesList.jsx  ← FINAL WORKING VERSION

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Paper, ListItem, ListItemText, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../api';  // ← Make sure you have this from earlier

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();

  // Load categories on mount
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Load error:', err));
  }, []);

  const addCategory = () => {
    api.post('/categories', { name: newName })
      .then(res => {
        setCategories([...categories, res.data]);  // ← Add new one instantly
        setNewName('');
        setOpen(false);
      })
      .catch(err => console.error('Add error:', err));
  };

  return (
    <>
      <Box textAlign="center" mb={6}>
        <Button variant="contained" size="large" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add New Category
        </Button>
      </Box>

      {categories.map(cat => (
        <Paper key={cat._id} elevation={8} sx={{ mb: 4, borderRadius: 3 }}>
          <ListItem
            button
            onClick={() => navigate(`/category/${cat._id}`)}
            sx={{ bgcolor: '#0d47a1', color: 'white', py: 3 }}
          >
            <ListItemText
              primary={cat.name}
              primaryTypographyProps={{ fontSize: 30, fontWeight: 'bold' }}
            />
          </ListItem>
        </Paper>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Category Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setNewName(''); }}>Cancel</Button>
          <Button onClick={addCategory} variant="contained" disabled={!newName.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}