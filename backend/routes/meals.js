// backend/routes/meals.js
const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const Hall = require('../models/Hall');
const auth = require('../middleware/auth');

// Get meals for a specific hall
router.get('/:hallId', auth, async (req, res) => {
  try {
    const meals = await Meal.find({ hallId: req.params.hallId });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new meal (admin only)
router.post('/', auth, async (req, res) => {
  // console.log("hit");
  try {
    const hall = await Hall.findById(req.body.hallId);
    await console.log("hit");
    // console.log(hall.adminId);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });
    // if (user.hallId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const meal = new Meal({
      hallId: req.body.hallId,
      date: req.body.date,
      type: req.body.type,
      menu: req.body.menu
    });

    const newMeal = await meal.save();
    res.status(201).json(newMeal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Order a meal
router.post('/:id/order', auth, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ message: 'Meal not found' });

    if (!meal.orders.includes(req.user.id)) {
      meal.orders.push(req.user.id);
      await meal.save();
    }

    res.json(meal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;