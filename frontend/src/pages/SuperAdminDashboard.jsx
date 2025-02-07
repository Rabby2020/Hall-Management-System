"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { getCurrentUser } from "../services/auth"

function SuperAdminDashboard() {
  const [halls, setHalls] = useState([])
  const [allowedAdmins, setAllowedAdmins] = useState([])
  const [newAllowedAdmin, setNewAllowedAdmin] = useState({ email: "", hallId: "" })
  const user = getCurrentUser()

  useEffect(() => {
    fetchHalls()
    fetchAllowedAdmins()
  }, [])

  const fetchHalls = async () => {
    try {
      const res = await axios.get("/api/halls", {
        headers: { "x-auth-token": user.token },
      })
      setHalls(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchAllowedAdmins = async () => {
    try {
      const res = await axios.get("/api/allowed-admins", {
        headers: { "x-auth-token": user.token },
      })
      setAllowedAdmins(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleInputChange = (e) => {
    setNewAllowedAdmin({ ...newAllowedAdmin, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("/api/allowed-admins", newAllowedAdmin, {
        headers: { "x-auth-token": user.token },
      })
      fetchAllowedAdmins()
      setNewAllowedAdmin({ email: "", hallId: "" })
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemoveAllowedAdmin = async (id) => {
    try {
      await axios.delete(`/api/allowed-admins/${id}`, {
        headers: { "x-auth-token": user.token },
      })
      fetchAllowedAdmins()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Super Admin Dashboard</h2>
      <h3>Add Allowed Admin</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={newAllowedAdmin.email}
          onChange={handleInputChange}
          required
        />
        <select name="hallId" value={newAllowedAdmin.hallId} onChange={handleInputChange} required>
          <option value="">Select Hall</option>
          {halls.map((hall) => (
            <option key={hall._id} value={hall._id}>
              {hall.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Allowed Admin</button>
      </form>
      <h3>Allowed Admins</h3>
      <ul>
        {allowedAdmins.map((admin) => (
          <li key={admin._id}>
            {admin.email} - {admin.hallId.name}
            <button onClick={() => handleRemoveAllowedAdmin(admin._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SuperAdminDashboard

