const mongoose = require("mongoose")

const AllowedAdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hall",
    required: true,
  },
})

module.exports = mongoose.model("AllowedAdmin", AllowedAdminSchema)

