const mongoose = require('mongoose');

const DeletedItemSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'category' or 'section' or 'entry'
  data: { type: mongoose.Schema.Types.Mixed, required: true }, // the full deleted object
  deletedAt: { type: Date, default: Date.now },
  deletedBy: String, // for supreme lord only
}, { timestamps: true });

// Auto-delete after 90 days
DeletedItemSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days in seconds

module.exports = mongoose.model('DeletedItem', DeletedItemSchema);