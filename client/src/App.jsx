import { Routes, Route } from 'react-router-dom';
import CategoriesList from './pages/CategoriesList';
import CategoryPage from './pages/CategoryPage';
import EntryPage from './pages/EntryPage';
import SectionPage from './pages/SectionPage';
import TokenDashboard from './pages/TokenDashboard';
import { Container, Typography, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function App() {
  return (
    <Routes>
      <Route path="/tokens" element={<TokenDashboard />} />
      <Route path="/" element={
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h3" align="center" color="#0d47a1" fontWeight="bold" gutterBottom>
            OTWDS v2 — House Handbook
          </Typography>
          <CategoriesList />
        </Container>
      } />
      <Route path="/category/:catId" element={<CategoryPage />} />
      <Route path="/category/:catId/section/:secId" element={<SectionPage />} />  {/* ← ADD THIS LINE */}
      <Route path="/entry/:entryId" element={<EntryPage />} />
    </Routes>
  );
}