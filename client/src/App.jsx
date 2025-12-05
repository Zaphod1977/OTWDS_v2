import { Routes, Route } from 'react-router-dom';
import CategoriesList from './pages/CategoriesList';
import CategoryPage from './pages/CategoryPage';
import EntryPage from './pages/EntryPage';
import SectionPage from './pages/SectionPage';
import TokenGenerator from './pages/TokenGenerator';
import AdminLoginPage from './pages/AdminLoginPage';
import ServiceLoginPage from './pages/ServiceLoginPage';
import { useAuth } from './context/AuthContext';
import { Container } from '@mui/material';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category/:catId" element={<CategoryPage />} />
      <Route path="/category/:catId/section/:secId" element={<SectionPage />} />
      <Route path="/entry/:entryId" element={<EntryPage />} />
      <Route path="/generate-token" element={<TokenGenerator />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route path="/service-login" element={<ServiceLoginPage />} />
    </Routes>
  );
}

function HomePage() {
  const { isAdmin, logout, loginAdmin } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Ownership block */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 py-12 border-b border-zinc-700">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Bobby Bridges
          </h1>
          <div className="space-y-3 text-zinc-300 text-lg">
            <p>802 West 6th St <br />
              Staunton, IL 62088<br />
              Phone: (314) 853-0016 <br />
              Email: carfiguru@gmail.com</p>
          </div>
        </div>
      </div>

      <CategoriesList />

      {/* ==================== LOGIN PANEL (only when NOT logged in) ==================== */}
      {!isAdmin && (
        <div id="login-section" className="py-20 bg-zinc-900">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Access Control</h2>

            <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">

              {/* ADMIN */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-indigo-400 text-center">Admin</h3>
                <button
                  onClick={() => {
                    const pw = prompt('Admin password:');
                    if (pw === 'your-real-password') {   // ← change this once
                      loginAdmin();
                    } else {
                      alert('Wrong password');
                    }
                  }}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xl shadow-lg transition"
                >
                  Admin Login
                </button>
              </div>

              {/* SERVICE USER */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-emerald-400 text-center">Service User</h3>
                <button
                  onClick={() => alert('Service login coming in 2 minutes')}
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-white font-bold rounded-xl text-xl shadow-lg transition"
                >
                  Service Login
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==================== ADMIN FLOATING BAR (only when logged in) ==================== */}
      {isAdmin && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-8 z-50">
          <button
            onClick={logout}
            className="px-12 py-5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xl shadow-2xl transition"
          >
            Logout
          </button>
          <Link
            to="/generate-token"
            className="px-12 py-5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xl shadow-2xl transition"
          >
            Generate Token
          </Link>
        </div>
      )}
    </Container>
  );
}