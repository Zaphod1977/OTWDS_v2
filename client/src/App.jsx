import { Routes, Route } from 'react-router-dom';
import CategoriesList from './pages/CategoriesList';
import CategoryPage from './pages/CategoryPage';
import EntryPage from './pages/EntryPage';
import SectionPage from './pages/SectionPage';
import AdminLoginPage from './pages/AdminLoginPage';
import { Container, Typography, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h3" align="center" color="#0d47a1" fontWeight="bold" gutterBottom>
            OTWDS v2
          </Typography>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Bobby Bridges
          </h1>
          <div className="space-y-1 text-zinc-300 text-lg">
            <p>802 West 6th St <br />
              Staunton, IL 62088<br />
              Phone: (314) 853-0016 <br />
              Email: carfiguru@gmail.com</p>
            <br />
          </div>
          <CategoriesList />
          {/* <AdminLoginPage/> */}
        </Container>
      } />
      <Route path="/category/:catId" element={<CategoryPage />} />
      <Route path="/category/:catId/section/:secId" element={<SectionPage />} />  {/* ← ADD THIS LINE */}
      <Route path="/entry/:entryId" element={<EntryPage />} />
    </Routes>
  );
}