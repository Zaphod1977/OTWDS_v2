import { Routes, Route } from 'react-router-dom';
import './App.css';
import CategoriesList from './pages/CategoriesList';
import CategoryPage from './pages/SubCategoryPage';
import EntryPage from './pages/EntryPage';
import SectionPage from './pages/UserEntriesPage';
import AdminLogin from './pages/AdminLogin';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import TokenGenerator from './pages/TokenGenerator'; // Add this if not already
import Header from './pages/Header';
import Footer from './pages/Footer';
import { AuthProvider } from './context/AuthContext';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="app-container">  {/* Add this class for the flex parent */}
      <AuthProvider>
        <Header />
        <main className="main-content">  {/* New wrapper: this will grow */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<PrivateRoute requiredRole={['admin', 'service']} />}>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/token-generator" element={<TokenGenerator />} />
            </Route>
            <Route path="/category/:catId" element={<CategoryPage />} />
            <Route path="/category/:catId/section/:secId" element={<SectionPage />} />
            <Route path="/entry/:entryId" element={<EntryPage />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </div>
  );
}