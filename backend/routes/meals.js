const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const auth = require('../middleware/auth');

// Get meals for a specific hall and date
router.get('/:hallId/:date', auth, async (req, res) => {
  try {
    const { hallId, date } = req.params;
    const meals = await Meal.find({ hallId, date: new Date(date) });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
  try {
    const { hallId, date, type, menu, price } = req.body;
    const meal = new Meal({
      hallId,
      date,
      type,
      menu,
      price,
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

// Cancel a meal order
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ message: 'Meal not found' });

    const orderIndex = meal.orders.indexOf(req.user.id);
    if (orderIndex > -1) {
      meal.orders.splice(orderIndex, 1);
      await meal.save();
    }

    res.json(meal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;