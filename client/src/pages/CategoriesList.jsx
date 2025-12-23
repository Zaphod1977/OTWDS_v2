import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Paper, ListItem, ListItemText, Button, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton, Typography } from '@mui/material'; // Added Typography for modal
import { Add, Delete as DeleteIcon } from '@mui/icons-material';

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data));
  }, []);

  const addCategory = () => {
    api.post('/categories', { name: newName })
      .then(() => {
        api.get('/categories')
          .then(res => setCategories(res.data));
        setNewName('');
        setOpen(false);
      })
      .catch(err => console.error('Error adding category', err));
  };

  const handleDelete = (id, e) => {
    e.stopPropagation(); // Prevent bubbling to ListItem onClick
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteOpen(false);
    try {
      await api.delete(`/categories/${deleteId}`);
      api.get('/categories')
        .then(res => setCategories(res.data));
    } catch (err) {
      console.error('Error deleting category', err);
      alert('Failed to delete category');
    }
  };

  return (
    <>
      <Box textAlign="right" mb={6}>
        <br></br>
        <br></br>
        <Button variant="contained" size="large" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add New Category
        </Button>
      </Box>

      {categories.map(cat => (
        <Paper key={cat._id} elevation={8} sx={{ mb: 4, borderRadius: 3 }}>
          <ListItem
            onClick={() => navigate(`/category/${cat._id}`)}
            sx={{ bgcolor: '#0d47a1', color: 'white', py: 3 }}
          >
            <ListItemText
              primary={cat.name}
              primaryTypographyProps={{ fontSize: 30, fontWeight: 'bold' }}
            />
            <IconButton onClick={(e) => handleDelete(cat._id, e)} sx={{ color: 'white' }}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        </Paper>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label="Name" value={newName} onChange={e => setNewName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={addCategory} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this category?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}