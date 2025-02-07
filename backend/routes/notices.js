// filepath: /c:/Users/User/hall-management_by_v0/hall-management-system/backend/routes/notices.js
const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const auth = require('../middleware/auth');

// Create a new notice (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { hallId, title, content } = req.body;
    const notice = new Notice({
      hallId,
      title,
      content,
    });

    const newNotice = await notice.save();
    res.status(201).json(newNotice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get notices for a specific hall
router.get('/:hallId', auth, async (req, res) => {
  try {
    const notices = await Notice.find({ hallId: req.params.hallId });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;