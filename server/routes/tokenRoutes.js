// server/routes/tokenRoutes.js
const express = require('express');
const router = express.Router();
const AccessToken = require('../models/AccessToken');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');

// Only SupremeLord & Admins can create tokens
router.use(auth);   // ← gatekeeper already checks SUPREMELORD_EMAILS & ADMIN_EMAILS

// POST /api/tokens/create
router.post('/create', async (req, res) => {
    try {
        const { categoryId, expiresIn } = req.body; // expiresIn: "12h", "24h", "7d", "30d", "never"

        // Generate beautiful 9-char token (uppercase + numbers)
        const token = crypto.randomBytes(5).toString('hex').toUpperCase().replace(/O|0/g, '8').replace(/I|L/g, '9').slice(0, 9);
        // Example result → "K9PX2M7V8"

        let expiresAt = null;
        if (expiresIn !== 'never') {
            const durations = {
                '12h': 6 * 60 * 60 * 1000,
                '12h': 12 * 60 * 60 * 1000,
                '24h': 24 * 60 * 60 * 1000,
                '3d': 3 * 24 * 60 * 60 * 1000,
                '7d': 7 * 24 * 60 * 60 * 1000,
                '30d': 30 * 24 * 60 * 60 * 1000,
            };
            expiresAt = new Date(Date.now() + durations[expiresIn]);
        }

        const accessToken = new AccessToken({
            token,
            categoryId,
            expiresAt,
        });

        await accessToken.save();
        res.status(201).json({ token, expiresAt });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    // GET /api/tokens — list all tokens (for the dashboard)
    router.get('/', async (req, res) => {
        try {
            const tokens = await AccessToken.find()
                .populate('categoryId', 'name')
                .sort('-createdAt');
            res.json(tokens);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // DELETE /api/tokens/:id — revoke a token
    router.delete('/:id', async (req, res) => {
        try {
            const token = await AccessToken.findByIdAndDelete(req.params.id);
            if (!token) return res.status(404).json({ message: 'Token not found' });
            res.json({ message: 'Token revoked forever' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
});

module.exports = router;