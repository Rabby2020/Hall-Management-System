"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [hallId, setHallId] = useState("")
  const [role, setRole] = useState("student") // Default role is 'student'
  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchHalls()
  }, [])

  const fetchHalls = async () => {
    try {
      setLoading(true)
      const res = await axios.get("/api/halls")
      setHalls(res.data)
      if (res.data.length > 0) {
        setHallId(res.data[0]._id)
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch halls. Please try again later.")
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log("Submitting form with role:", role)
      // Send the role along with other user data
      const res = await axios.post("/api/auth/register", { name, email, password, hallId, role })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("userId", res.data.userId)
      localStorage.setItem("role", res.data.role)
      localStorage.setItem("hallId", res.data.hallId)
      if (role === "student") {
        console.log("Redirecting to /user")
        navigate("/user")
      } else if (role === "admin") {
        console.log("Redirecting to /admin")
        navigate("/admin")
      }
    } catch (err) {
      console.error(err.response.data)
      setError(err.response.data.msg || "Registration failed. Please try again.")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (halls.length === 0) {
    return <div>No halls available for registration. Please contact the administrator.</div>
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={hallId} onChange={(e) => setHallId(e.target.value)} required>
          {halls.map((hall) => (
            <option key={hall._id} value={hall._id}>
              {hall.name}
            </option>
          ))}
        </select>

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register