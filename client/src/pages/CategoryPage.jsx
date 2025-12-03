// client/src/pages/CategoryPage.jsx  ← FINAL, BULLETPROOF, NO MORE BUGS

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button, Typography, Container, Paper, ListItem, ListItemText,
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton
} from '@mui/material';
import { ArrowBack, Add, Delete } from '@mui/icons-material';

export default function CategoryPage() {
  const { catId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [sections, setSections] = useState([]);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(null); // { id, type }

  useEffect(() => {
    axios.get(`http://localhost:5000/api/categories/${catId}`)
      .then(res => setCategory(res.data))
      .catch(() => {
        axios.get('http://localhost:5000/api/categories')
          .then(res => setCategory(res.data.find(c => c._id === catId)));
      });

    axios.get(`http://localhost:5000/api/sections?categoryId=${catId}`)
      .then(res => setSections(res.data));
  }, [catId]);

  const addSection = () => {
    axios.post('http://localhost:5000/api/sections', { name: newName, categoryId: catId })
      .then(res => {
        setSections([...sections, res.data]);
        setNewName('');
        setOpen(false);
      });
  };

  const confirmDelete = (id, type) => {
    setDeleteDialog({ id, type });
  };

  const executeDelete = () => {
    axios.delete(`http://localhost:5000/api/sections/${deleteDialog.id}`)
      .then(() => {
        setSections(sections.filter(s => s._id !== deleteDialog.id));
        setDeleteDialog(null);
      });
  };

  if (!category) return <Typography align="center" sx={{ mt: 10 }}>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: 5 }}>
        ← Back
      </Button>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Typography variant="h3" color="#0d47a1" fontWeight="bold">
          {category.name}
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Section
        </Button>
      </Box>

      {sections.map(sec => (
        <Paper key={sec._id} elevation={6} sx={{ mb: 4, borderRadius: 3 }}>
          <ListItem
            button
            onClick={() => navigate(`/category/${catId}/section/${sec._id}`)}
            sx={{ bgcolor: '#1976d2', color: 'white', py: 4, cursor: 'pointer' }}
          >
            <ListItemText
              primary={sec.name}
              primaryTypographyProps={{ fontSize: 28, fontWeight: 'bold' }}
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
        <DialogTitle>Add New Section</DialogTitle>
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