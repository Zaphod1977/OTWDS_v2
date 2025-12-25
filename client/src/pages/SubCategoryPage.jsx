import { useEffect, useState } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button, Typography, Container, Paper, ListItem, ListItemText,
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

export default function SubCategoryPage() {
  const { catId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [sections, setSections] = useState([]);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(null); // { id, type }

  useEffect(() => {
    api.get('/categories') // Add /api/ if your proxy is set
      .then(res => {
        const cat = res.data.find(c => c._id === catId);
        if (cat) setCategory(cat);
      })
      .catch(err => console.error('Error fetching categories:', err));

    api.get(`/sections?categoryId=${catId}`)
      .then(res => setSections(res.data))
      .catch(err => console.error('Error fetching sections:', err));
  }, [catId]);

  const addSection = () => {
    if (!newName.trim()) {
      alert('Name is required');
      return;
    }
    console.log('Sending POST:', { name: newName, categoryId: catId }); // Debug log
    api.post('/sections', { name: newName, categoryId: catId })
      .then(response => {
        console.log('POST success:', response.data); // Debug log
        api.get(`/sections?categoryId=${catId}`)
          .then(res => setSections(res.data));
        setNewName('');
        setOpen(false);
      })
      .catch(err => {
        console.error('Error adding section:', err);
        alert(err.response?.data?.error || 'Failed to add sub category');
      });
  };

  const confirmDelete = (id, type) => {
    setDeleteDialog({ id, type });
  };

  const executeDelete = () => {
    api.delete(`/sections/${deleteDialog.id}`)
      .then(() => {
        api.get(`/sections?categoryId=${catId}`)
          .then(res => setSections(res.data));
        setDeleteDialog(null);
      })
      .catch(err => {
        console.error('Error deleting section:', err);
        alert(err.response?.data?.error || 'Failed to delete sub category');
      });
  };

  if (!category) return <Typography align="center" sx={{ mt: 10 }}>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
        Sub Category Page
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Typography variant="h5" color="#1b2431ff" fontWeight="bold">
          {category.name}
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Sub Category
        </Button>
      </Box>

      {sections.map(sec => (
        <Paper key={sec._id} elevation={6} sx={{ mb: 4, borderRadius: 3 }}>
          <ListItem
            onClick={() => navigate(`/category/${catId}/section/${sec._id}`)}
            sx={{ bgcolor: '#1976d2', color: 'white', py: 3, cursor: 'pointer' }}
          >
            <ListItemText
              primary={sec.name}
              primaryTypographyProps={{ fontSize: 22, fontWeight: 'bold' }}
            />
            <IconButton
              color="inherit"
              onClick={(e) => { e.stopPropagation(); confirmDelete(sec._id, 'section'); }}
            >
              <Delete />
            </IconButton>
          </ListItem>
        </Paper>
      ))}

      {/* Add Section Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Sub Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setNewName(''); }}>Cancel</Button>
          <Button onClick={addSection} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Delete Section?</DialogTitle>
        <DialogContent>
          <Typography>This will move to recycle bin for 90 days.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button onClick={executeDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}