const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  title: { type: String, required: true },
  content: { type: String },           // Rich text notes
  images: [{ type: String }],           // Array of base64 strings (simple & works forever)
  date: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },        // display name or role
  createdByEmail: { type: String, required: true },   // actual email (for lookups later)
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Entry', EntrySchema);