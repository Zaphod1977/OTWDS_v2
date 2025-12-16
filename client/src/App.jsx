import { Routes, Route } from 'react-router-dom';
import './App.css';
import CategoriesList from './pages/CategoriesList';
import CategoryPage from './pages/CategoryPage';
import EntryPage from './pages/EntryPage';
import SectionPage from './pages/SectionPage';
import AdminLogin from './pages/AdminLogin';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/AdminDashboard'; // New
import Header from './pages/Header'; // New
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/category/:catId" element={<CategoryPage />} />
        <Route path="/category/:catId/section/:secId" element={<SectionPage />} />
        <Route path="/entry/:entryId" element={<EntryPage />} />
      </Routes>
    </>
  );
}