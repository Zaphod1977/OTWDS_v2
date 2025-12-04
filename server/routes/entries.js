const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
// THE ONE TRUE GATEKEEPER — LOCKS EVERY ROUTE BELOW
const { auth } = require('../middleware/auth');
router.use(auth);                     // ← THIS LINE PROTECTS EVERYTHING
// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

// POST /api/entries
router.post('/', async (req, res) => {
  try {
    const { title, content, images, section } = req.body;

    // THIS IS THE SUPREMELORD'S MARK
    const isSupremelord = req.user.role === "supremelord";
    const creatorName = isSupremelord ? "SupremeLord" : "Admin";

    const entry = new Entry({
      title,
      content,
      images,
      section,
      createdBy: creatorName,           // ← "SupremeLord" or "Admin"
      createdByEmail: req.user.email,   // ← actual email
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/entries?sectionId=xxx
router.get('/', async (req, res) => {
  const { sectionId } = req.query;
  const entries = await Entry.find({ section: sectionId })
    .where('deleted').ne(true)   // ← THIS LINE
    .sort('-createdAt');
  res.json(entries);
});

// GET single entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE entry (permanent) — YOU ALREADY HAVE THIS AND IT WORKS
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Entry deleted forever' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;