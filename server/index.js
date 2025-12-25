require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://main.d3qk4r01h8cob1.amplifyapp.com',
    'https://www.otwds.com/',
    'https://otwds.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Added 'DELETE'
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' })); // THIS LINE
app.use(express.urlencoded({ limit: '50mb', extended: true })); // and this one (good practice)
app.use('/api/auth', require('./routes/auth'));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/entries', require('./routes/entries'));
app.use('/api/deletedItems', require('./routes/deletedItems'));
app.use('/api/auth', require('./routes/auth'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend alive and talking to Atlas!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));