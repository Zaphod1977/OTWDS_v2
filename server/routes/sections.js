const express = require('express');
const router = express.Router();
const Section = require('../models/Section');

// POST /api/sections
router.post('/', async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const section = new Section({ name, category: categoryId });
    await section.save();
    res.status(201).json(section);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/sections?categoryId=xxx
router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.query;
    const sections = await Section.find({ category: categoryId })
      .where('deleted').ne(true)
      .sort({ order: 1, createdAt: -1 });  // keeps your custom order + newest first
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single section by ID (for the SectionPage header)
router.get('/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).json({ error: 'Not found' });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE section (permanent)
router.delete('/:id', async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Section deleted forever' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;