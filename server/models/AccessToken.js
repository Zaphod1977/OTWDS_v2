const mongoose = require('mongoose');

const AccessTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },      // e.g. L9kP2mX9v
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

  // First-time identity (filled on first login)
  name: { type: String },
  phone: { type: String },
  company: { type: String },

  // Timing
  expiresAt: { type: Date },               // null = never expires
  createdAt: { type: Date, default: Date.now },
  revoked: { type: Boolean, default: false },
});

module.exports = mongoose.model('AccessToken', AccessTokenSchema);