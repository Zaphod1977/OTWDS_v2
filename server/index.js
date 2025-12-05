const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());   // ← simple, dumb, always works in dev

// Middleware
app.use(express.json({ limit: '50mb' }));        // ← THIS LINE
app.use(express.urlencoded({ limit: '50mb', extended: true })); // ← and this one (good practice)

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const tokenRoutes = require('./routes/tokenRoutes');
app.use('/api/tokens', tokenRoutes);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/entries', require('./routes/entries'));
app.use('/api/deletedItems', require('./routes/deletedItems'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend alive and talking to Atlas!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));