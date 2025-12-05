// server/routes/serviceRoutes.js  ← FINAL 100% WORKING VERSION
const express = require('express');
const router = express.Router();
const { tokenAuth } = require('../middleware/tokenAuth');

// SERVICE USER LOGIN — NEVER BLOCK FIRST-TIME
router.post('/login', tokenAuth, async (req, res) => {
  const token = req.tokenData;

  // FIRST-TIME USER — DO NOT RETURN 400, JUST LET FRONTEND SHOW FORM
  if (req.isFirstLogin) {
    const { name, phone, company } = req.body;
    if (name) {
      token.name = name.trim();
      token.phone = phone?.trim();
      token.company = company?.trim();
      await token.save();
    }
    // Even if no name yet, still return category — frontend will show form
  }

  res.json({
    category: req.category,
    user: {
      name: token.name || null,
      phone: token.phone || null,
      company: token.company || null
    },
    isFirstLogin: req.isFirstLogin && !token.name
  });
});

module.exports = router;