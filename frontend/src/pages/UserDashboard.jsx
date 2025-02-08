"use client"

import { useState, useEffect } from "react"
import axios from "axios"

function UserDashboard() {
  const [meals, setMeals] = useState([])
  const [hallId, setHallId] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedMeals, setSelectedMeals] = useState([])
  const [notices, setNotices] = useState([])
  const [showNotices, setShowNotices] = useState(false)

  useEffect(() => {
    fetchUserHall()
  }, [])

  useEffect(() => {
    if (hallId) {
      fetchMeals()
    }
  }, [hallId])

  useEffect(() => {
    if (selectedDate) {
      fetchMealsByDate()
    }
  }, [selectedDate])

  const fetchUserHall = async () => {
    try {
      const res = await axios.get("/api/auth/me", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      setHallId(res.data.hallId)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchMeals = async () => {
    try {
      const res = await axios.get(`/api/meals/${hallId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      setMeals(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchMealsByDate = async () => {
    try {
      const res = await axios.get(`/api/meals/${hallId}/${selectedDate}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      setSelectedMeals(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`/api/notices/${hallId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      setNotices(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const orderMeal = async (mealId) => {
    try {
      await axios.post(
        `/api/meals/${mealId}/order`,
        {},
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        },
      )
      fetchMealsByDate()
    } catch (err) {
      console.error(err)
    }
  }

  const cancelOrder = async (mealId) => {
    try {
      await axios.post(
        `/api/meals/${mealId}/cancel`,
        {},
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        },
      )
      fetchMealsByDate()
    } catch (err) {
      console.error(err)
    }
  }

  const isOrderable = (mealDate) => {
    const today = new Date()
    const mealDay = new Date(mealDate)
    const diffTime = mealDay - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 1
  }

  const handleSeeNotices = () => {
    if (!showNotices) {
      fetchNotices()
    }
    setShowNotices(!showNotices)
  }

  return (
    <div className="container mt-4" style={{ minHeight: "100vh" }}>
      <h2 className="mb-4 text-center">User Dashboard</h2>

      <div className="mb-4">
        <h3>Check Meals for a Specific Day</h3>
        <label>Select Date: </label>
        <input
          type="date"
          className="form-control w-auto d-inline"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <h4>Available Meals</h4>
        {selectedMeals.length > 0 ? (
          <div className="list-group">
            {selectedMeals.map((meal) => (
              <div key={meal._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5>{new Date(meal.date).toLocaleDateString()} - {meal.type}</h5>
                  <p>{meal.menu} - ${meal.price}</p>
                </div>
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => orderMeal(meal._id)}
                    disabled={!isOrderable(meal.date) || meal.orders.includes(localStorage.getItem("userId"))}
                  >
                    {meal.orders.includes(localStorage.getItem("userId")) ? "Ordered" : "Order"}
                  </button>
                  <button
                    className="btn btn-danger ml-2"
                    onClick={() => cancelOrder(meal._id)}
                    disabled={!isOrderable(meal.date) || !meal.orders.includes(localStorage.getItem("userId"))}
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No meals available for the selected date.</p>
        )}
      </div>

      <div className="mb-4">
        <button className="btn btn-info" onClick={handleSeeNotices}>
          {showNotices ? "Hide Notices" : "See Notices"}
        </button>
        {showNotices && (
          <div className="mt-3">
            <h4>Recent Notices for Your Hall</h4>
            {notices.length > 0 ? (
              <div className="list-group">
                {notices.map((notice) => (
                  <div key={notice._id} className="list-group-item">
                    <h5>{notice.title}</h5>
                    <p>{notice.content}</p>
                    <small>{new Date(notice.date).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p>No notices at the moment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
