import { Routes, Route } from 'react-router-dom';
import './App.css';
import CategoryPage from './pages/CategoryPage';
import EntryPage from './pages/EntryPage';
import SectionPage from './pages/SectionPage';
import Footer from './pages/Footer';
import AdminLogin from './pages/AdminLogin'; // If keeping standalone, but embedded now
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard'; // New/renamed from AdminDashboard
import Header from './pages/Header'; // New import

export default function App() {
  return (
    <>
      <Header /> {/* Global header */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/category/:catId" element={<CategoryPage />} />
        <Route path="/category/:catId/section/:secId" element={<SectionPage />} />
        <Route path="/entry/:entryId" element={<EntryPage />} />
      </Routes>
      {/* <Footer /> if global */}
    </>
  );
}