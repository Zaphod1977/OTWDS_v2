// server/routes/categories.js  ← FINAL — SERVICE USERS CAN READ
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { auth } = require('../middleware/auth');

// PUBLIC — SERVICE USERS CAN READ CATEGORIES & SINGLE CATEGORY
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().where('deleted').ne(true);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.deleted) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PROTECTED — ONLY SUPREMELORD/ADMIN CAN WRITE
router.use(auth);

router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;