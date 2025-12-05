import { Routes, Route } from 'react-router-dom';
import CategoriesList from './pages/CategoriesList';
import CategoryPage from './pages/CategoryPage';
import EntryPage from './pages/EntryPage';
import SectionPage from './pages/SectionPage';   // ← ADD THIS LINE
import { Container, Typography, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* ===== TOP-RIGHT LOGIN BUTTON ===== */}
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={() => {
                document
                  .getElementById("login-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg transition"
            >
              Login
            </button>
          </div>
          {/* ===== OWNERSHIP BLOCK - TOP ===== */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 py-12 border-b border-zinc-700">
            <div className="max-w-4xl mx-auto text-center px-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Bobby Bridges
              </h1>
              <div className="space-y-3 text-zinc-300 text-lg">
                <p>802 West 6th St<br />Staunton, IL. 62088<br />
                  Phone: (314) 853-0016<br />
                  Email: carfiguru@gmail.com</p>
              </div>
            </div>
          </div>          <CategoriesList />
          {/* ===== BOTTOM LOGIN SECTION ===== */}
          <div id="login-section" className="py-20 bg-zinc-900 border-t border-zinc-700">
            <div className="max-w-2xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-white text-center mb-12">
                Access Control
              </h2>

              <div className="grid md:grid-cols-2 gap-10 max-w-lg mx-auto">

                {/* ADMIN */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-indigo-400 text-center">Admin</h3>
                  <input
                    type="password"
                    placeholder="Admin password"
                    className="w-full px-6 py-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500 text-center text-lg"
                    disabled
                  />
                  <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition text-lg">
                    Admin Login
                  </button>
                </div>

                {/* SERVICE USER */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-emerald-400 text-center">Service User</h3>
                  <input
                    type="text"
                    placeholder="Paste token here"
                    className="w-full px-6 py-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 text-center text-lg"
                    disabled
                  />
                  <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition text-lg">
                    Service Login
                  </button>
                </div>
              </div>

              {/* GENERATE TOKEN BUTTON – visible to everyone for now */}
              <div className="mt-12 text-center">
                <button className="px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-lg transition">
                  Generate Token (Admin only)
                </button>
              </div>
            </div>
          </div>
          {/* Placeholder so we have something to scroll to */}
          <div id="login-section" className="h-20" />
        </Container>
      } />
      <Route path="/category/:catId" element={<CategoryPage />} />
      <Route path="/category/:catId/section/:secId" element={<SectionPage />} />  {/* ← ADD THIS LINE */}
      <Route path="/entry/:entryId" element={<EntryPage />} />
    </Routes>
  );
}