import { Routes, Route } from 'react-router-dom';
import './App.css';
import CategoriesList from './pages/CategoriesList';
import CategoryPage from './pages/CategoryPage';
import EntryPage from './pages/EntryPage';
import SectionPage from './pages/SectionPage';
import Footer from './pages/Footer'
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard'; // Kept as ./components to match your current setup
import PrivateRoute from './components/PrivateRoute'; // Assuming you created it here
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom'; // Added for the link button

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <Container className="newBack" maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
            OTWDS v2
          </Typography>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Bobby Bridges
          </h1>
          <div className="space-y-1 text-zinc-300 text-lg">
            <p>802 West 6th St <br />
              Staunton, IL 62088<br />
              Phone: (314) 853-0016 <br />
              Email: carfiguru@gmail.com</p>
          </div>
          <Button
            component={Link}
            to="/admin-login"
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
          >
            Admin Login
          </Button>
          <CategoriesList />

          <Footer />
        </Container>
      } />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route element={<PrivateRoute />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Route>
      <Route path="/category/:catId" element={<CategoryPage />} />
      <Route path="/category/:catId/section/:secId" element={<SectionPage />} />
      <Route path="/entry/:entryId" element={<EntryPage />} />
    </Routes>
  );
}