"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { getCurrentUser } from "../services/auth"

function AdminDashboard() {
  const [newMeal, setNewMeal] = useState({ date: "", type: "", menu: "", price: "" })
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedMeals, setSelectedMeals] = useState([])
  const user = getCurrentUser()

  useEffect(() => {
    if (selectedDate) {
      fetchMealsByDate()
    }
  }, [selectedDate])

  const fetchMealsByDate = async () => {
    try {
      const res = await axios.get(`/api/meals/${user.hallId}/${selectedDate}`, {
        headers: { "x-auth-token": user.token },
      })
      setSelectedMeals(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleInputChange = (e) => {
    setNewMeal({ ...newMeal, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        "/api/meals",
        { ...newMeal, hallId: user.hallId },
        {
          headers: { "x-auth-token": user.token },
        },
      )
      fetchMealsByDate() // Refresh the meals for the selected date
      setNewMeal({ date: "", type: "", menu: "", price: "" })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <input type="date" name="date" value={newMeal.date} onChange={handleInputChange} required />
        <select name="type" value={newMeal.type} onChange={handleInputChange} required>
          <option value="">Select Meal Type</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
        <textarea name="menu" placeholder="Menu" value={newMeal.menu} onChange={handleInputChange} required></textarea>
        <input type="number" name="price" placeholder="Price" value={newMeal.price} onChange={handleInputChange} required />
        <button type="submit">Add Meal</button>
      </form>
      <h3>Check Meals and Orders for a Specific Day</h3>
      <label>Select Date: </label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <ul>
        {selectedMeals.map((meal) => (
          <li key={meal._id}>
            {new Date(meal.date).toLocaleDateString()} - {meal.type}: {meal.menu} - ${meal.price}
            <p>Total Orders: {meal.orders.length}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminDashboard