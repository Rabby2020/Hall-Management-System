const express = require("express")
const router = express.Router()
const AllowedAdmin = require("../models/AllowedAdmin")
const auth = require("../middleware/auth")

// Middleware to check if user is a system-admin
const systemAdminAuth = (req, res, next) => {
  if (req.user.role !== "system-admin") {
    return res.status(403).json({ msg: "Access denied. System admin only." })
  }
  next()
}

// Get all allowed admins
router.get("/", [auth, systemAdminAuth], async (req, res) => {
  try {
    const allowedAdmins = await AllowedAdmin.find().populate("hallId", "name")
    res.json(allowedAdmins)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// Add a new allowed admin
router.post("/", [auth, systemAdminAuth], async (req, res) => {
  try {
    const { email, hallId } = req.body
    const newAllowedAdmin = new AllowedAdmin({ email, hallId })
    await newAllowedAdmin.save()
    res.json(newAllowedAdmin)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// Remove an allowed admin
router.delete("/:id", [auth, systemAdminAuth], async (req, res) => {
  try {
    await AllowedAdmin.findByIdAndRemove(req.params.id)
    res.json({ msg: "Allowed admin removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router

