const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Hall = require("../models/Hall")
const auth = require("../middleware/auth")

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, hallId, role } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ msg: "User already exists" })
    }

    // Check if any halls exist
    const hallCount = await Hall.countDocuments()
    if (hallCount === 0) {
      return res.status(400).json({ msg: "No halls available for registration" })
    }

    // If hallId is not provided, assign the first available hall
    let selectedHallId = hallId
    if (!selectedHallId) {
      const firstHall = await Hall.findOne()
      if (firstHall) {
        selectedHallId = firstHall._id
      } else {
        return res.status(400).json({ msg: "No halls available for registration" })
      }
    }

    // Check if hall exists
    const hall = await Hall.findById(selectedHallId)
    if (!hall) {
      return res.status(400).json({ msg: "Invalid hall" })
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      hallId: selectedHallId,
      role, // Set default role to student
    })

    // Hash password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    await user.save()

    // Create and return JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err
      res.json({
        token,
        userId: user.id,
        role: user.role,
        hallId: user.hallId,
      })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" })
    }

    // Create and return JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err
      res.json({
        token,
        userId: user.id,
        role: user.role,
        hallId: user.hallId,
      })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router