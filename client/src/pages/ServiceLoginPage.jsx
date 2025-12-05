// src/pages/ServiceLoginPage.jsx
import { Link } from 'react-router-dom';

export default function ServiceLoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-2xl shadow-2xl p-10 border border-zinc-800">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Service User Login
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Paste your access token below
        </p>

        <input
          type="text"
          placeholder="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-center text-lg mb-6"
          disabled
        />

        <button
          className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xl shadow-lg transition opacity-70"
          disabled
        >
          Login with Token (coming in 2 min)
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