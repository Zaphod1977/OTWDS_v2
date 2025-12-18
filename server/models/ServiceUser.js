const mongoose = require('mongoose');

const serviceUserSchema = new mongoose.Schema({
  name: String,
  company: String,
  phone: String,
  email: String,
  token: String, // Linked token
  catId: String // Granted category
});

module.exports = mongoose.model('ServiceUser', serviceUserSchema);