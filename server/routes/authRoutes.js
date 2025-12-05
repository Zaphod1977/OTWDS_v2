// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const getEmailsArray = (envVar) =>
  process.env[envVar]
    ? process.env[envVar].split(",").map(e => e.trim().toLowerCase())
    : [];

const SUPREMELORD_EMAILS = getEmailsArray("SUPREMELORD_EMAILS");
const ADMIN_EMAILS = getEmailsArray("ADMIN_EMAILS");

// POST /api/auth/login  ← this is what the page above calls
router.post('/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const lower = email.toLowerCase();

  if (SUPREMELORD_EMAILS.includes(lower) || ADMIN_EMAILS.includes(lower)) {
    const token = jwt.sign(
      { email: lower },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    return res.json({ token });
  }

  res.status(403).json({ message: "Access denied. Not a SupremeLord or Admin." });
});

module.exports = router;