const mongoose = require("mongoose")
const Hall = require("../models/Hall")
require("dotenv").config()

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const existingHalls = await Hall.find()
    if (existingHalls.length === 0) {
      const defaultHall = new Hall({
        name: "Default Hall",
      })
      await defaultHall.save()
      console.log("Default hall created successfully")
    } else {
      console.log("Halls already exist, no need to create a default hall")
    }

    mongoose.connection.close()
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

initializeDatabase()

