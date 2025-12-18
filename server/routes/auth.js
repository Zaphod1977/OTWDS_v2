const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Token = require('../models/Token');
const ServiceUser = require('../models/ServiceUser');

const JWT_SECRET = process.env.JWT_SECRET || 'bobby2025'; // Add this to your .env file for security
const ADMIN_HASH = '$2b$10$0Yh0GUni4BeSm8./plG4PeXLboC6Cn.0Wwdv9c5iIYyDcNo6hdywi';

// Admin login endpoint
router.post('/admin-login', async (req, res) => {
  console.log('Received body:', req.body); // Add this
  const { code } = req.body;
  try {
    const isMatch = await bcrypt.compare(code, ADMIN_HASH);
    if (isMatch) {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ success: true, token });
    }
    return res.status(401).json({ success: false, message: 'Invalid code' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Token Generator
router.post('/generate-token', async (req, res) => {
  const { name, timeFrame, category } = req.body;
  try {
    const expiry = calculateExpiry(timeFrame);
    const token = crypto.randomBytes(5).toString('hex'); // 10 characters (5 bytes hex)
    const newToken = new Token({ token, catId: category, expiry, generatedBy: 'admin' });
    await newToken.save();
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
    const sessionToken = jwt.sign({ role: 'service', catId: storedToken.catId }, JWT_SECRET, { expiresIn: '1h' });
    const newUser = new ServiceUser({ name, company, phone, email, token, catId: storedToken.catId });
    await newUser.save();
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