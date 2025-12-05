import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function TokenGenerator() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');

  // Hard-coded list for now — matches your real categories exactly
  const categories = [
    'High Voltage',
    'Low Voltage',
    'Garage Build',
    'Body & Paint',
    'Interior',
    'Audio & Electronics',
    'Wheels & Suspension',
    'Engine & Drivetrain',
  ];

  const generateToken = () => {
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    // Super simple token format you can change later
    const token = btoa(`service|${selectedCategory}|${Date.now() + 30*24*60*60*1000}`); // 30-day expiry
    navigator.clipboard.writeText(token);
    alert(`Token copied to clipboard!\n\n${token}\n\nValid for: ${selectedCategory}`);
  };

  // Security: only admin can be here
  if (!isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-xl shadow-2xl p-8 border border-zinc-700">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Generate Service Token
        </h1>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-6 py-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white text-lg mb-6"
        >
          <option value="">Select allowed category...</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button
          onClick={generateToken}
          className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xl transition"
        >
          Generate & Copy Token
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}