import { Routes, Route } from 'react-router-dom';
import CategoriesList from './pages/CategoriesList';
import CategoryPage from './pages/CategoryPage';
import EntryPage from './pages/EntryPage';
import SectionPage from './pages/SectionPage';
import { useAuth } from './context/AuthContext';
import { Container } from '@mui/material';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category/:catId" element={<CategoryPage />} />
      <Route path="/category/:catId/section/:secId" element={<SectionPage />} />
      <Route path="/entry/:entryId" element={<EntryPage />} />
    </Routes>
  );
}

function HomePage() {
  const { isAdmin, logout } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Top-right button */}
      {isAdmin ? (
        <button
          onClick={logout}
          className="fixed top-4 right-4 z-50 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-lg transition"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="fixed top-4 right-4 z-50 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg transition"
        >
          Login
        </button>
      )}

      {/* Ownership block */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 py-12 border-b border-zinc-700">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Bobby Bridges
          </h1>
          <div className="space-y-3 text-zinc-300 text-lg">
            <p>802 West 6th St<br />Staunton, IL 62088</p>
            <p className="mt-4">Phone: (314) 853-0016</p>
            <p>Email: carfiguru@gmail.com</p>
          </div>
        </div>
      </div>

      <CategoriesList />

      {/* Bottom login section – hidden when admin logged in */}
      {!isAdmin && (
        <div id="login-section" className="py-20 bg-zinc-900 border-t border-zinc-700">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Access Control</h2>

            <div className="grid md:grid-cols-2 gap-10 max-w-lg mx-auto">
              {/* ADMIN */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-400 text-center">Admin</h3>
                <input type="password" placeholder="Admin password" className="w-full px-6 py-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 text-center text-lg" disabled />
                <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-lg">
                  Admin Login
                </button>
              </div>

              {/* SERVICE USER */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-emerald-400 text-center">Service User</h3>
                <input type="text" placeholder="Paste token here" className="w-full px-6 py-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 text-center text-lg" disabled />
                <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-lg">
                  Service Login
                </button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button className="px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-lg">
                Generate Token (Admin only)
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}