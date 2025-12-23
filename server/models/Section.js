// Updated Section.js (added creator fields; kept all existing)
const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  creatorName: { type: String },        // New: Service user name
  creatorCompany: { type: String },     // New: Company name
  creatorPhone: { type: String },       // New: Phone number
  creatorEmail: { type: String },       // New: Email address
  order: { type: Number, default: 0 },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Section', SectionSchema);