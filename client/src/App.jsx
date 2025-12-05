// client/src/App.jsx  ← THIS IS THE TRUTH
import { Routes, Route } from 'react-router-dom';
import TokenDashboard from './pages/TokenDashboard';
import ServiceUserView from './pages/ServiceUserView';
import CategoryList from './pages/CategoriesList';     // ← YOUR MASTERPIECE
import CategoryPage from './pages/CategoryPage';
import SectionPage from './pages/SectionPage';

function App() {
  return (
    <Routes>
      {/* Admin login */}
      <Route path="/tokens" element={<TokenDashboard />} />
      
      {/* Service user token entry */}
      <Route path="/service" element={<ServiceUserView />} />
      
      {/* EVERYTHING ELSE — YOUR MASTERPIECE */}
      <Route path="/" element={<CategoryList />} />
      <Route path="/category/:catId" element={<CategoryPage />} />
      <Route path="/category/:catId/section/:secId" element={<SectionPage />} />
    </Routes>
  );
}

export default App;