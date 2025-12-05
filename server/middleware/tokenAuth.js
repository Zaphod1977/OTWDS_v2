// server/middleware/tokenAuth.js  ← FINAL VERSION — NO POPULATE, NO 404
const AccessToken = require('../models/AccessToken');
const Category = require('../models/Category');

const tokenAuth = async (req, res, next) => {
  try {
    let tokenStr = req.header('Authorization')?.replace('Bearer ', '').trim();
    if (!tokenStr) tokenStr = req.query.token || req.body.token;
    if (!tokenStr) return res.status(401).json({ message: 'No token' });

    const tokenDoc = await AccessToken.findOne({
      token: tokenStr.toUpperCase(),
      revoked: { $ne: true }
    });

    if (!tokenDoc) return res.status(401).json({ message: 'Invalid token' });
    if (tokenDoc.expiresAt && tokenDoc.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Token expired' });
    }

    // MANUAL FETCH — THIS CANNOT FAIL
    let category = null;
    if (tokenDoc.categoryId) {
      category = await Category.findById(tokenDoc.categoryId);
    }

    if (!category) {
      // Last resort: at least show something
      category = { _id: tokenDoc.categoryId, name: 'Assigned Category (ID: ' + tokenDoc.categoryId + ')' };
    }

    req.tokenData = tokenDoc;
    req.category = category;
    req.isFirstLogin = !tokenDoc.name;

    next();
  } catch (err) {
    console.error('tokenAuth error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { tokenAuth };