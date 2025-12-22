const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Section = require('../models/Section'); 
const Entry = require('../models/Entry');

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
  const categories = await Category.find().sort('order')
    .where('deleted').ne(true)   // ← THIS LINE
    .sort('-createdAt');
  res.json(categories);
});

// GET single category by ID (for the CategoryPage header)
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE category
router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const sections = await Section.find({ catId: categoryId });
    for (const section of sections) {
      await Entry.deleteMany({ secId: section._id });
      await Section.findByIdAndDelete(section._id);
    }
    await Category.findByIdAndDelete(categoryId);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;