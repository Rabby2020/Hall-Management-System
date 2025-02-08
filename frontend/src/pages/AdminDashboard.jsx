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
    <div className="container mt-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      
      {/* Meal Creation Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Add New Meal</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={newMeal.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Meal Type</label>
              <select
                name="type"
                className="form-control"
                value={newMeal.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Meal Type</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
            <div className="form-group">
              <label>Menu</label>
              <textarea
                name="menu"
                className="form-control"
                placeholder="Menu"
                value={newMeal.menu}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                className="form-control"
                placeholder="Price"
                value={newMeal.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Meal</button>
          </form>
        </div>
      </div>

      {/* Meals and Orders for a Specific Day */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Check Meals and Orders for a Specific Day</h5>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label>Select Date</label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <ul className="list-group">
            {selectedMeals.map((meal) => (
              <li key={meal._id} className="list-group-item">
                <h6>{new Date(meal.date).toLocaleDateString()} - {meal.type}</h6>
                <p>{meal.menu} - ${meal.price}</p>
                <p><strong>Total Orders: </strong>{meal.orders.length}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Publish Notice Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Publish Notice for Your Hall</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleNoticeSubmit}>
            <div className="form-group">
              <label>Notice Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Notice Title"
                value={newNotice.title}
                onChange={handleNoticeInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Notice Content</label>
              <textarea
                name="content"
                className="form-control"
                placeholder="Notice Content"
                value={newNotice.content}
                onChange={handleNoticeInputChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Publish Notice</button>
          </form>
        </div>
      </div>

      {/* Notices Section */}
      <div>
        <button className="btn btn-info mb-3" onClick={handleSeeNotices}>
          {showNotices ? "Hide Notices" : "See Notices"}
        </button>
        {showNotices && (
          <div className="card">
            <div className="card-header">
              <h5>Recent Notices for Your Hall</h5>
            </div>
            <div className="card-body">
              {notices.length > 0 ? (
                <ul className="list-group">
                  {notices.map((notice) => (
                    <li key={notice._id} className="list-group-item">
                      <h6>{notice.title}</h6>
                      <p>{notice.content}</p>
                      <small>{new Date(notice.date).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notices at the moment.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
