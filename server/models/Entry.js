// Updated Entry.js (added creator fields; kept all existing)
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
  creatorName: { type: String },        // New: Service user name
  creatorCompany: { type: String },     // New: Company name
  creatorPhone: { type: String },       // New: Phone number
  creatorEmail: { type: String },       // New: Email address
  date: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Entry', EntrySchema);