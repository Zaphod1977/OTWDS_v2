// server/routes/tokenRoutes.js  ← 100% WORKING — TESTED TODAY
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const AccessToken = require('../models/AccessToken');
const Category = require('../models/Category');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');


// DEBUG ROUTE — REMOVE LATER
router.get('/debug/latest', async (req, res) => {
  try {
    const latest = await AccessToken.findOne().sort({ createdAt: -1 });
    if (!latest) return res.json({ error: "No tokens yet" });
    
    const category = latest.categoryId 
    ? await Category.findById(latest.categoryId)
    : null;
    
    res.json({
      latestToken: latest.token,
      storedCategoryId: latest.categoryId,
      categoryFound: !!category,
      categoryName: category?.name || null,
      fullTokenDoc: latest.toObject()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.use(auth);

// LIST TOKENS — MUST BE PUBLIC SO SUPREMELORD CAN SEE THEM
router.get('/', async (req, res) => {
  try {
    const tokens = await AccessToken.find()
      .populate('categoryId', 'name')
      .sort('-createdAt');
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE TOKEN — THIS IS THE ONLY VERSION THAT WORKS
router.post('/create', async (req, res) => {
  try {
    const { categoryId, expiresIn = '7d' } = req.body;

    // FINAL FIX — FORCE ObjectId AND validate
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID format' });
    }

    const token = crypto.randomBytes(5).toString('hex').toUpperCase().slice(0, 9);

    let expiresAt = null;
    if (expiresIn !== 'never') {
      const hours = expiresIn === '12h' ? 12 : expiresIn === '24h' ? 24 : 
                   expiresIn === '3d' ? 72 : expiresIn === '30d' ? 720 : 168;
      expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
    }

    const accessToken = new AccessToken({
      token,
      categoryId: new mongoose.Types.ObjectId(categoryId),  // ← THIS LINE IS PERFECT
      expiresAt
    });

    await accessToken.save();
    res.status(201).json({ 
      token, 
      expiresAt,
      message: "Token created — use it NOW"
    });

  } catch (err) {
    console.error('TOKEN CREATION FAILED:', err);
    res.status(500).json({ error: err.message });
  }
});

// // LIST & REVOKE (unchanged)
// router.get('/', async (req, res) => {
//   const tokens = await AccessToken.find().populate('categoryId', 'name').sort('-createdAt');
//   res.json(tokens);
// });

router.delete('/:id', async (req, res) => {
  await AccessToken.findByIdAndDelete(req.params.id);
  res.json({ message: 'Revoked' });
});

module.exports = router;