// server/routes/sections.js  ← FINAL — PUBLIC READ FOR SERVICE USERS
const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const { auth } = require('../middleware/auth');

// PUBLIC — SERVICE USERS CAN READ SECTIONS
router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.query;
    const query = categoryId ? { categoryId } : {};
    const sections = await Section.find(query).sort('order');
    res.json(sections);
  } catch (err) {
    console.error('Sections GET error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PROTECTED — ONLY SUPREMELORD/ADMIN CAN WRITE
router.use(auth);

router.post('/', async (req, res) => {
  try {
    const section = new Section(req.body);
    await section.save();
    res.status(201).json(section);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Section.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;