const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
// THE ONE TRUE GATEKEEPER — LOCKS EVERY ROUTE BELOW
const { auth } = require('../middleware/auth');
router.use(auth);                     // ← THIS LINE PROTECTS EVERYTHING
// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

// POST /api/categories → create a new category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/categories → list all
router.get('/', async (req, res) => {
  const categories = await Category.find()
    .sort('order')
    .where('deleted').ne(true)
    .sort('-createdAt');
  res.json(categories);
});

// GET single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE category (permanent)
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Category deleted forever' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;