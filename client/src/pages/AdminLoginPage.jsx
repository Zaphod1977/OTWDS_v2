// src/pages/AdminLoginPage.jsx
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminLoginPage() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    const pw = prompt('Admin password:');
    if (pw === 'bobby2025') {            // ← change whenever you want
      loginAdminLogin();
      navigate('/');                     // send them back home
    } else {
      alert('Wrong password');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-2xl shadow-2xl p-10 border border-zinc-800">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Admin Login
        </h1>

        <button
          onClick={handleLogin}
          className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xl shadow-lg transition"
        >
          Enter Admin Area
        </button>

        <Link
          to="/"
          className="block text-center mt-6 text-zinc-400 hover:text-white transition"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}