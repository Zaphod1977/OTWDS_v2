import { useEffect, useState, useContext } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Paper, ListItem, ListItemText, Button, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton, Typography } from '@mui/material';
import { Add, Delete as DeleteIcon } from '@mui/icons-material';
import AuthContext from '../context/AuthContext';

export default function CategoriesList() {
  const { user } = useContext(AuthContext); // Get role and catId from context
  const role = user?.role || '';
  const permittedCatId = user?.catId || ''; // From token for service
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
    e.stopPropagation(); // Prevent navigation
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
    <Box sx={{ m: 2 }}>  {/* Adds 16px margin on all sides; use p: 2 for padding instead if preferred */}
      {role === 'admin' && (
        <Box textAlign="right" mb={6}>
          <br></br>
          <br></br>
          <Button variant="contained" size="large" startIcon={<Add />} onClick={() => setOpen(true)}>
            Add New Category
          </Button>
        </Box>
      )}

      {categories.map(cat => {
        const isPermitted = role !== 'service' || cat._id === permittedCatId; // Admin all, service only permitted
        return (
          <Paper key={cat._id} elevation={8} sx={{ mb: 4, borderRadius: 3 }}>
            <ListItem
              onClick={isPermitted ? () => navigate(`/category/${cat._id}`) : null}
              sx={{ bgcolor: '#0d47a1', color: isPermitted ? 'white' : 'gray', py: 3, cursor: isPermitted ? 'pointer' : 'not-allowed' }}
            >
              <ListItemText
                primary={cat.name}
                primaryTypographyProps={{ fontSize: 30, fontWeight: 'bold' }}
              />
              {role === 'admin' && (
                <IconButton onClick={(e) => handleDelete(cat._id, e)} sx={{ color: 'white' }}>
                  <DeleteIcon />
                </IconButton>
              )}
            </ListItem>
          </Paper>
        );
      })}
    </Box>

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