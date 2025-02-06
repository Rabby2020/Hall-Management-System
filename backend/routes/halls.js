// backend/routes/halls.js
const express = require('express');
const router = express.Router();
const Hall = require('../models/Hall');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all halls
router.get("/", async (req, res) => {
    try {
      const halls = await Hall.find()
      res.json(halls)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

// Create a new hall (this should be a protected route, only accessible by a super admin)
router.post('/', auth, async (req, res) => {
  const hall = new Hall({
    name: req.body.name
  });

  try {
    const newHall = await hall.save();
    res.status(201).json(newHall);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Assign admin to a hall (this should be a protected route, only accessible by a super admin)
router.patch('/:id/assign-admin', auth, async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);
    const user = await User.findById(req.body.userId);

    if (!hall) return res.status(404).json({ message: 'Hall not found' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    hall.adminId = user._id;
    user.role = 'admin';

    await hall.save();
    await user.save();

    res.json(hall);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;