// backend/models/Meal.js
const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['lunch', 'dinner'], required: true },
  menu: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Meal', MealSchema);