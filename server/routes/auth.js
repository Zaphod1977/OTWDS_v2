const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'bobby2025'; // Add this to your .env file for security
const ADMIN_HASH = '$2b$10$aj4AJW2jRTbjSKtUIdRFSeeWbhIwRck4OR3HCJfRFaxguYu9dN4.W'; 

// const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('Zaphod1977', 10));

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

module.exports = router;