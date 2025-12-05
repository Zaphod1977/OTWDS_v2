// client/src/pages/CategoryList.jsx  ← FIXED NAVIGATION & DATA FETCH
import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { 
  Button, Typography, Container, Paper, ListItem, ListItemText, 
  Box, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, IconButton 
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';   // ← THIS LINE FIXED
export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Categories load failed:', err));
  }, []);

  const addCategory = () => {
    if (!newName.trim()) return;
    api.post('/categories', { name: newName })
      .then(res => {
        setCategories([...categories, res.data]);
        setNewName('');
        setOpen(false);
      });
  };

  const deleteCategory = (id) => {
    if (!window.confirm('Delete this category and ALL its sections/entries forever?')) return;

    api.delete(`/categories/${id}`)
      .then(() => {
        setCategories(categories.filter(c => c._id !== id));
      })
      .catch(err => {
        console.error('Delete failed:', err);
        alert('Delete failed — check console');
      });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Button variant="contained" size="large" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add New Category
        </Button>
      </Box>

      {categories.map(cat => (
        <Paper key={cat._id} elevation={8} sx={{ mb: 4, borderRadius: 3 }}>
          <ListItem
            button
            onClick={() => {
              console.log('Navigating to category ID:', cat._id);  // DEBUG
              navigate(`/category/${cat._id}`);
            }}
            sx={{ bgcolor: '#0d47a1', color: 'white', py: 4 }}
          >
            <ListItemText
              primary={cat.name}
              primaryTypographyProps={{ fontSize: 30, fontWeight: 'bold' }}
            />
            <IconButton
              color="inherit"
              onClick={(e) => {
                e.stopPropagation();
                deleteCategory(cat._id);
              }}
            >
              <Delete />
            </IconButton>
          </ListItem>
        </Paper>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setNewName(''); }}>Cancel</Button>
          <Button onClick={addCategory} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}