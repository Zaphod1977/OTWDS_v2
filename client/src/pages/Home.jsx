// client/src/pages/Home.jsx
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 15 }}>
      <Typography variant="h1" color="#0f0" fontWeight="bold" gutterBottom>
        ON THE WALL DATA SYSTEMS
      </Typography>
      <Typography variant="h5" color="#aaa" sx={{ mb: 8 }}>
        Select your access level
      </Typography>

      <Box sx={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/tokens')}
          sx={{
            bgcolor: '#0f0',
            color: '#000',
            px: 8,
            py: 4,
            fontSize: '1.8rem',
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#0c0' }
          }}
        >
          ADMIN / SUPREMELORD
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/service')}
          sx={{
            borderColor: '#0f0',
            color: '#0f0',
            px: 8,
            py: 4,
            fontSize: '1.8rem',
            fontWeight: 'bold',
            '&:hover': { borderColor: '#0f0', bgcolor: 'rgba(0,255,0,0.1)' }
          }}
        >
          SERVICE USER
        </Button>
      </Box>
    </Container>
  );
}