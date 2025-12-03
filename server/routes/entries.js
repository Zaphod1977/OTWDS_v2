const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// POST /api/entries
router.post('/', async (req, res) => {
  try {
    const entry = new Entry(req.body);
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