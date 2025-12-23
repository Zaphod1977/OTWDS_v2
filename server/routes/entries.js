const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// POST /api/entries
router.post('/', async (req, res) => {
  try {
    const { title, content, section, images, creatorName, creatorCompany, creatorPhone, creatorEmail } = req.body;
    if (!title || !section) {
      return res.status(400).json({ error: 'Title and section ID are required' });
    }
    const entry = new Entry({
      title,
      content,
      section, // Matches schema field
      images,
      creatorName,
      creatorCompany,
      creatorPhone,
      creatorEmail
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/entries?sectionId=xxx
router.get('/', async (req, res) => {
  try {
    const { sectionId } = req.query;
    const entries = await Entry.find({ section: sectionId })
      .where('deleted').ne(true)
      .sort('-createdAt');
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

// DELETE entry (permanent)
router.delete('/:id', async (req, res) => {
  try {
    await Entry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;