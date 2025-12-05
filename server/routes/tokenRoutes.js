// server/routes/tokenRoutes.js
const express = require('express');
const router = express.Router();
const AccessToken = require('../models/AccessToken');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');

router.use(auth);

// CREATE
router.post('/create', async (req, res) => {
  try {
    const { categoryId, expiresIn = '7d' } = req.body;
    const token = crypto.randomBytes(5).toString('hex').toUpperCase().slice(0, 9);

    let expiresAt = null;
    if (expiresIn !== 'never') {
      const map = { '12h': 12*60*60*1000, '24h': 24*60*60*1000, '3d': 3*24*60*60*1000, '7d': 7*24*60*60*1000, '30d': 30*24*60*60*1000 };
      expiresAt = new Date(Date.now() + (map[expiresIn] || map['7d']));
    }

    const accessToken = new AccessToken({ token, categoryId, expiresAt });
    await accessToken.save();
    res.status(201).json({ token, expiresAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LIST
router.get('/', async (req, res) => {
  try {
    const tokens = await AccessToken.find().populate('categoryId', 'name').sort('-createdAt');
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REVOKE
router.delete('/:id', async (req, res) => {
  try {
    const result = await AccessToken.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Token not found' });
    res.json({ message: 'Token revoked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;   // THIS LINE MUST BE HERE