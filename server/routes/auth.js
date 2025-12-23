const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Token = require('../models/Token');
const ServiceUser = require('../models/ServiceUser');

const JWT_SECRET = process.env.JWT_SECRET || 'bobby2025'; // Use your env var
const ADMIN_HASH = '$2b$10$0Yh0GUni4BeSm8./plG4PeXLboC6Cn.0Wwdv9c5iIYyDcNo6hdywi';

// Middleware to verify admin (already there, keeping it)
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    console.log('Token verification error:', err ? err.message : 'No error');
    console.log('Decoded user:', user);
    if (err) return res.status(403).json({ message: 'Invalid token' });
    if (user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    req.user = user;
    next();
  });
};

// New: Middleware to verify user (service or admin)
const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attaches decoded user details (name, company, etc.) to req
    if (decoded.role === 'admin') return next(); // Admins can add anywhere
    if (decoded.role === 'service' && decoded.catId === req.body.categoryId) { // Service users only for their category
      return next();
    }
    return res.status(403).json({ error: 'Insufficient permissions' });
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin login endpoint
router.post('/admin-login', async (req, res) => {
  console.log('Received body:', req.body); // Add this
  const { code } = req.body;
  try {
    const isMatch = await bcrypt.compare(code, ADMIN_HASH);
    if (isMatch) {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '6h' });
      return res.json({ success: true, token });
    }
    return res.status(401).json({ success: false, message: 'Invalid code' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Token Generator (with admin verification)
router.post('/generate-token', verifyAdmin, async (req, res) => {
  const { name, timeFrame, category } = req.body;
  try {
    const expiry = calculateExpiry(timeFrame);
    const token = crypto.randomBytes(5).toString('hex'); // 10 chars
    const newToken = new Token({ token, catId: category, expiry, generatedBy: 'admin' });
    await newToken.save(); // Store in DB
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

function calculateExpiry(timeFrame) {
  const now = new Date();
  switch (timeFrame) {
    case '6hrs': return new Date(now.getTime() + 6 * 3600000);
    case '12hrs': return new Date(now.getTime() + 12 * 3600000);
    case '24hrs': return new Date(now.getTime() + 24 * 3600000);
    case '48hrs': return new Date(now.getTime() + 48 * 3600000);
    case '120hrs': return new Date(now.getTime() + 120 * 3600000);
    case 'infinite': return new Date(now.getTime() + 100 * 365 * 24 * 3600000); // ~100 years
    default: return new Date(now.getTime() + 24 * 3600000); // Default 24 hrs
  }
}

// Service User Login
router.post('/service-login', async (req, res) => {
  const { token, name, company, phone, email } = req.body;
  try {
    const storedToken = await Token.findOne({ token });
    if (!storedToken || new Date() > storedToken.expiry) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    const sessionToken = jwt.sign({ role: 'service', catId: storedToken.catId, name, company }, JWT_SECRET, { expiresIn: '1h' }); // Include name/company in session for metadata
    const newUser = new ServiceUser({ name, company, phone, email, token, catId: storedToken.catId });
    await newUser.save(); // Store details
    res.json({ success: true, token: sessionToken });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Token Validation
router.post('/validate-token', async (req, res) => {
  const { token } = req.body;
  try {
    const storedToken = await Token.findOne({ token });
    if (!storedToken || new Date() > storedToken.expiry) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;