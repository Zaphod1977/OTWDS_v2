import { useEffect, useState } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button, Typography, Container, Paper,
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, IconButton
} from '@mui/material';
import { Add, CameraAlt, Delete } from '@mui/icons-material';

export default function UserEntriesPage() {
  const { catId, secId } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [entries, setEntries] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(null);

  useEffect(() => {
    api.get(`/sections/${secId}`)
      .then(res => setSection(res.data))
      .catch(err => console.error('Error fetching section:', err));
    api.get(`/entries?sectionId=${secId}`)
      .then(res => setEntries(res.data))
      .catch(err => console.error('Error fetching entries:', err));
  }, [secId]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, reader.result]);
      reader.readAsDataURL(f);
    });
  };

  const saveEntry = () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    console.log('Sending POST:', { title, content, section: secId, images }); // Debug log
    api.post('/entries', { title, content, section: secId, images })
      .then(response => {
        console.log('POST success:', response.data); // Debug log
        api.get(`/entries?sectionId=${secId}`)
          .then(res => setEntries(res.data));
        setTitle(''); setContent(''); setImages([]); setOpen(false);
      })
      .catch(err => {
        console.error('Error adding entry:', err);
        alert(err.response?.data?.error || 'Failed to add entry');
      });
  };

  const confirmDelete = (id) => setDeleteDialog(id);
  const executeDelete = () => {
    api.delete(`/entries/${deleteDialog}`)
      .then(() => {
        api.get(`/entries?sectionId=${secId}`)
          .then(res => setEntries(res.data));
        setDeleteDialog(null);
      })
      .catch(err => {
        console.error('Error deleting entry:', err);
        alert(err.response?.data?.error || 'Failed to delete entry');
      });
  };

  if (!section) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
        Service User Entry Page
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Typography variant="h5" color="#1b2431ff" fontWeight="bold">
          {section.name}
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Entry
        </Button>
      </Box>

      {entries.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 8 }}>
          No entries yet — add your first entry
        </Typography>
      ) : (
        entries.map(entry => (
          <Paper
            key={entry._id}
            elevation={4}
            sx={{ mb: 4, p: 3, cursor: 'pointer', position: 'relative' }}
            onClick={() => navigate(`/entry/${entry._id}`)}
          >
            <Typography variant="h5" gutterBottom>{entry.title}</Typography>
            <Typography color="text.secondary">
              {new Date(entry.createdAt).toLocaleDateString()}
            </Typography>
            <IconButton
              sx={{ position: 'absolute', top: 8, right: 8 }}
              color="error"
              onClick={(e) => { e.stopPropagation(); confirmDelete(entry._id); }}
            >
              <Delete />
            </IconButton>
          </Paper>
        ))
      )}

      {/* ADD ENTRY DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Entry to {section.name}</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth sx={{ mt: 2 }} value={title} onChange={e => setTitle(e.target.value)} />
          <TextField label="Notes" fullWidth multiline rows={6} sx={{ mt: 2 }} value={content} onChange={e => setContent(e.target.value)} />
          <Button variant="contained" component="label" startIcon={<CameraAlt />} sx={{ mt: 2 }}>
            Upload Photos
            <input type="file" hidden accept="image/*" multiple onChange={handleImageUpload} />
          </Button>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {images.map((img, i) => (
              <Grid item key={i}>
                <img src={img} style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 8 }}  alt="preview" />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setTitle(''); setContent(''); setImages([]); }}>Cancel</Button>
          <Button onClick={saveEntry} variant="contained">Save Entry</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Delete Entry?</DialogTitle>
        <DialogContent><Typography>Are you sure?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button onClick={executeDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}