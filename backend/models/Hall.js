// backend/models/Hall.js
const mongoose = require('mongoose');

const HallSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
//   adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Hall', HallSchema);