import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Paper, Grid, Box } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

export default function EntryPage() {
  const { entryId } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);

  useEffect(() => {
  axios.get(`http://localhost:5000/api/entries/${entryId}`)
    .then(res => setEntry(res.data))
    .catch(() => {
      // fallback: search all entries
      axios.get('http://localhost:5000/api/entries')
        .then(res => setEntry(res.data.find(e => e._id === entryId)));
    });
  }, [entryId]);

  if (!entry) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back
      </Button>

      <Typography variant="h3" gutterBottom fontWeight="bold">
        {entry.title}
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        {new Date(entry.createdAt).toLocaleString()}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {entry.images?.map((img, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Paper elevation={3}>
              <img src={img} alt="" style={{ width: '100%', display: 'block', borderRadius: 8 }} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {entry.content && (
        <Paper sx={{ mt: 4, p: 4 }}>
          <Typography variant="h6" gutterBottom>Notes</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap', fontSize: 18 }}>
            {entry.content}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}