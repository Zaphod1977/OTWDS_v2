// client/src/pages/CategoryPage.jsx  ← FINAL — NO FLICKER, NO ERRORS, SECTIONS LOAD
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Button, Typography, Container, Paper, ListItem, ListItemText, Box } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

export default function CategoryPage({ serviceToken }) {
  const { catId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [sections, setSections] = useState([]);

  const headers = serviceToken 
    ? { headers: { Authorization: `Bearer ${serviceToken}` } }
    : {};

useEffect(() => {
  if (!catId) return;

  console.log("Fetching category:", catId, "with token:", serviceToken?.slice(0, 10) + "...");

  // Fetch category
  api.get(`/api/categories/${catId}`, headers)
    .then(res => {
      console.log("Category SUCCESS:", res.data);
      setCategory(res.data);
    })
    .catch(err => {
      console.error("Category FAILED:", err.response?.status, err.response?.data);
      setCategory({ name: `Error ${err.response?.status || '???'} — Check token` });
    });

  // Fetch sections
  api.get(`/sections?categoryId=${catId}`, headers)
    .then(res => {
      console.log("Sections SUCCESS:", res.data);
      setSections(res.data);
    })
    .catch(err => {
      console.error("Sections FAILED:", err.response?.status);
      setSections([]);
    });
}, [catId, serviceToken]);

  // ONLY RENDER WHEN WE HAVE DATA
  if (!category) {
    return (
      <Container sx={{ textAlign: 'center', mt: 20 }}>
        <Typography color="#0f0" fontSize={48}>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/')}>Back</Button>

      <Typography variant="h2" color="#0f0" textAlign="center" my={6} fontWeight="bold">
        {category.name}
      </Typography>

      {sections.length === 0 ? (
        <Typography align="center" color="#888" fontSize={32}>
          No sections yet.
        </Typography>
      ) : (
        sections.map(sec => (
          <Paper key={sec._id} sx={{ p: 4, mb: 4, bgcolor: '#1565c0', color: 'white' }}>
            <ListItem
              button
              onClick={() => navigate(`/category/${catId}/section/${sec._id}`)}
              sx={{ py: 3 }}
            >
              <ListItemText
                primary={sec.name}
                primaryTypographyProps={{ fontSize: 36, fontWeight: 'bold' }}
              />
            </ListItem>
          </Paper>
        ))
      )}
    </Container>
  );
}