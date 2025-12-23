import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react'; import AuthContext from '../context/AuthContext';
import { Paper, ListItem, ListItemText, Button, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton } from '@mui/material'; // Added IconButton
import { Add, Delete as DeleteIcon } from '@mui/icons-material';

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data));
  }, []);

  const { user } = useContext(AuthContext); const role = user?.role || '';

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

  const handleDelete = async (id, e) => { // Added e parameter
    e.stopPropagation(); // Prevent bubbling to ListItem onClick
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        api.get('/categories') // Refetch to refresh list
          .then(res => setCategories(res.data));
      } catch (err) {
        console.error('Error deleting category', err);
      }
    }
  };


  return (
    <>
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
        const isPermitted = role !== 'service' || cat._id === user.catId; // Admin all, service permitted only
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
    </>
  );
}