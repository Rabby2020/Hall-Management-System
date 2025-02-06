"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { getCurrentUser } from "../services/auth"

function AdminDashboard() {
  const [meals, setMeals] = useState([])
  const [newMeal, setNewMeal] = useState({ date: "", type: "", menu: "" })
  const user = getCurrentUser()

  useEffect(() => {
    fetchMeals()
  }, [])

  const fetchMeals = async () => {
    try {
      const res = await axios.get(`/api/meals/${user.hallId}`, {
        headers: { "x-auth-token": user.token },
      })
      setMeals(res.data)
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
      );
      fetchMeals();
      setNewMeal({ date: "", type: "", menu: "" });
    } catch (err) {
      console.error(err);
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
        <button type="submit">Add Meal</button>
      </form>
      <h3>Meals</h3>
      <ul>
        {meals.map((meal) => (
          <li key={meal._id}>
            {new Date(meal.date).toLocaleDateString()} - {meal.type}: {meal.menu}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminDashboard

