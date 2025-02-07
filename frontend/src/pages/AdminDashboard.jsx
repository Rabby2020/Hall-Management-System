"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { getCurrentUser } from "../services/auth"

function AdminDashboard() {
  const [newMeal, setNewMeal] = useState({ date: "", type: "", menu: "", price: "" })
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedMeals, setSelectedMeals] = useState([])
  const [notices, setNotices] = useState([])
  const [newNotice, setNewNotice] = useState({ title: "", content: "" })
  const [showNotices, setShowNotices] = useState(false)
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

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`/api/notices/${user.hallId}`, {
        headers: { "x-auth-token": user.token },
      })
      setNotices(res.data)
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

  const handleNoticeInputChange = (e) => {
    setNewNotice({ ...newNotice, [e.target.name]: e.target.value })
  }

  const handleNoticeSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        "/api/notices",
        { ...newNotice, hallId: user.hallId },
        {
          headers: { "x-auth-token": user.token },
        },
      )
      fetchNotices() // Refresh the notices
      setNewNotice({ title: "", content: "" })
    } catch (err) {
      console.error(err)
    }
  }

  const handleSeeNotices = () => {
    if (!showNotices) {
      fetchNotices()
    }
    setShowNotices(!showNotices)
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
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newMeal.price}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Meal</button>
      </form>
      <h3>Check Meals and Orders for a Specific Day</h3>
      <label>Select Date: </label>
      <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      <ul>
        {selectedMeals.map((meal) => (
          <li key={meal._id}>
            {new Date(meal.date).toLocaleDateString()} - {meal.type}: {meal.menu} - ${meal.price}
            <p>Total Orders: {meal.orders.length}</p>
          </li>
        ))}
      </ul>
      <div>
        <h3>Publish Notice for Your Hall</h3>
        <form onSubmit={handleNoticeSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Notice Title"
            value={newNotice.title}
            onChange={handleNoticeInputChange}
            required
          />
          <textarea
            name="content"
            placeholder="Notice Content"
            value={newNotice.content}
            onChange={handleNoticeInputChange}
            required
          ></textarea>
          <button type="submit">Publish Notice</button>
        </form>
        <button onClick={handleSeeNotices}>{showNotices ? "Hide Notices" : "See Notices"}</button>
        {showNotices && (
          <div>
            <h3>Recent Notices for Your Hall</h3>
            {notices.length > 0 ? (
              <ul>
                {notices.map((notice) => (
                  <li key={notice._id}>
                    <h4>{notice.title}</h4>
                    <p>{notice.content}</p>
                    <small>{new Date(notice.date).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notices at the moment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard

