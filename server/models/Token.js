const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: String,
  catId: String,
  expiry: Date,
  permissions: String, // e.g., 'read-write'
  generatedBy: String // Admin ID or name
});

module.exports = mongoose.model('Token', tokenSchema);