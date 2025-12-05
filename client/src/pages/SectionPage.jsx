// client/src/pages/SectionPage.jsx  ← FINAL — ENTRIES WITH TITLE, TEXT, IMAGE
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Button, Typography, Container, Box, Paper, TextField, IconButton } from '@mui/material';
import { ArrowBack, Add, Delete } from '@mui/icons-material';

export default function SectionPage() {
  const { catId, secId } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    api.get(`/sections/${secId}`).then(res => setSection(res.data));
    api.get(`/entries?sectionId=${secId}`).then(res => setEntries(res.data));
  }, [secId]);

  const addEntry = () => {
    if (!title.trim()) return;
    api.post('/entries', { title, content, image, sectionId: secId })
      .then(res => {
        setEntries([...entries, res.data]);
        setTitle('');
        setContent('');
        setImage('');
      });
  };

  const deleteEntry = (id) => {
    if (!window.confirm('Delete entry?')) return;
    api.delete(`/entries/${id}`).then(() => {
      setEntries(entries.filter(e => e._id !== id));
    });
  };

  if (!section) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(`/category/${catId}`)}>Back</Button>

      <Typography variant="h3" color="#0f0" textAlign="center" my={4}>
        {section.name}
      </Typography>

      <Box component="form" onSubmit={(e) => { e.preventDefault(); addEntry(); }} mb={6} p={4} bgcolor="#111" borderRadius={3}>
        <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} required />
        <TextField fullWidth multiline rows={4} label="Content" value={content} onChange={(e) => setContent(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Image URL (optional)" value={image} onChange={(e) => setImage(e.target.value)} sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" startIcon={<Add />} color="success">
          Add Entry
        </Button>
      </Box>

      {entries.length === 0 ? (
        <Typography align="center" color="#888" fontSize={28}>No entries yet.</Typography>
      ) : (
        entries.map(entry => (
          <Paper key={entry._id} sx={{ p: 4, mb: 4, bgcolor: '#222', color: '#fff' }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h5" fontWeight="bold">{entry.title}</Typography>
                <Typography sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>{entry.content}</Typography>
                {entry.image && <img src={entry.image} alt="entry" style={{ maxWidth: '100%', mt: 2, borderRadius: 8 }} />}
                <Typography color="#0f0" fontSize={12} mt={2}>
                  Added by: {entry.createdBy || 'Unknown'}
                </Typography>
              </Box>
              <IconButton color="error" onClick={() => deleteEntry(entry._id)}>
                <Delete />
              </IconButton>
            </Box>
          </Paper>
        ))
      )}
    </Container>
  );
}