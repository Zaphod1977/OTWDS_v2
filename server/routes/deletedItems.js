const express = require('express');
const router = express.Router();
const DeletedItem = require('../models/DeletedItem');
const Category = require('../models/Category');
const Section = require('../models/Section');
const Entry = require('../models/Entry');

// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
// THE ONE TRUE GATEKEEPER — LOCKS EVERY ROUTE BELOW
const { auth } = require('../middleware/auth');
router.use(auth);                     // ← THIS LINE PROTECTS EVERYTHING
// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←


// GET all deleted items (supreme lord only)
router.get('/', async (req, res) => {
  try {
    const deleted = await DeletedItem.find().sort('-deletedAt');
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST restore deleted item (supreme lord only)
router.post('/:id/restore', async (req, res) => {
  try {
    const deleted = await DeletedItem.findById(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });

    let restored;
    if (deleted.type === 'category') {
      restored = new Category(deleted.data);
    } else if (deleted.type === 'section') {
      restored = new Section(deleted.data);
    } else if (deleted.type === 'entry') {
      restored = new Entry(deleted.data);
    }
    await restored.save();
    await deleted.remove();

    res.json({ message: 'Restored successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;