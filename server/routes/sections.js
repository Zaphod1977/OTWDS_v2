const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const Entry = require('../models/Entry');


// POST /api/sections
router.post('/', async (req, res) => {
  try {
    const { name, catId, creatorName, creatorCompany, creatorPhone, creatorEmail } = req.body;
    const timestamp = new Date();
    const section = new Section({ name, catId, creatorName, creatorCompany, creatorPhone, creatorEmail, timestamp });
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
    await Entry.deleteMany({ secId: req.params.id }); // Delete associated entries
    await Section.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Section deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;