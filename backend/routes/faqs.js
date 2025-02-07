const express = require("express")
const router = express.Router()
const FAQ = require("../models/FAQ")
const auth = require("../middleware/auth")

// Get all FAQs
router.get("/", async (req, res) => {
  try {
    const faqs = await FAQ.find()
    res.json(faqs)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// Add a new FAQ (system-admin only)
router.post(
  "/",
  [
    auth,
    (req, res, next) => {
      if (req.user.role !== "system-admin") {
        return res.status(403).json({ msg: "Access denied. System admin only." })
      }
      next()
    },
  ],
  async (req, res) => {
    try {
      const { question, answer } = req.body
      const newFAQ = new FAQ({ question, answer })
      await newFAQ.save()
      res.json(newFAQ)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  },
)

// Update an FAQ (system-admin only)
router.put(
  "/:id",
  [
    auth,
    (req, res, next) => {
      if (req.user.role !== "system-admin") {
        return res.status(403).json({ msg: "Access denied. System admin only." })
      }
      next()
    },
  ],
  async (req, res) => {
    try {
      const { question, answer } = req.body
      const faq = await FAQ.findByIdAndUpdate(req.params.id, { question, answer }, { new: true })
      if (!faq) {
        return res.status(404).json({ msg: "FAQ not found" })
      }
      res.json(faq)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  },
)

// Delete an FAQ (system-admin only)
router.delete(
  "/:id",
  [
    auth,
    (req, res, next) => {
      if (req.user.role !== "system-admin") {
        return res.status(403).json({ msg: "Access denied. System admin only." })
      }
      next()
    },
  ],
  async (req, res) => {
    try {
      const faq = await FAQ.findByIdAndRemove(req.params.id)
      if (!faq) {
        return res.status(404).json({ msg: "FAQ not found" })
      }
      res.json({ msg: "FAQ removed" })
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  },
)

module.exports = router

