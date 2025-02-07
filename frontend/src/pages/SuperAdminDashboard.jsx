"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { getCurrentUser } from "../services/auth"

function SuperAdminDashboard() {
  const [halls, setHalls] = useState([])
  const [allowedAdmins, setAllowedAdmins] = useState([])
  const [newAllowedAdmin, setNewAllowedAdmin] = useState({ email: "", hallId: "" })
  const [faqs, setFaqs] = useState([])
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" })
  const user = getCurrentUser()

  useEffect(() => {
    fetchHalls()
    fetchAllowedAdmins()
    fetchFaqs()
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

  const fetchFaqs = async () => {
    try {
      const res = await axios.get("/api/faqs", {
        headers: { "x-auth-token": user.token },
      })
      setFaqs(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleInputChange = (e) => {
    setNewAllowedAdmin({ ...newAllowedAdmin, [e.target.name]: e.target.value })
  }

  const handleFaqInputChange = (e) => {
    setNewFaq({ ...newFaq, [e.target.name]: e.target.value })
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

  const handleFaqSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("/api/faqs", newFaq, {
        headers: { "x-auth-token": user.token },
      })
      fetchFaqs()
      setNewFaq({ question: "", answer: "" })
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

  const handleRemoveFaq = async (id) => {
    try {
      await axios.delete(`/api/faqs/${id}`, {
        headers: { "x-auth-token": user.token },
      })
      fetchFaqs()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Super Admin Dashboard</h2>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Add Allowed Admin</h3>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={newAllowedAdmin.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
          <select
            name="hallId"
            value={newAllowedAdmin.hallId}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Hall</option>
            {halls.map((hall) => (
              <option key={hall._id} value={hall._id}>
                {hall.name}
              </option>
            ))}
          </select>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Allowed Admin
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Allowed Admins</h3>
        <ul className="space-y-2">
          {allowedAdmins.map((admin) => (
            <li key={admin._id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>
                {admin.email} - {admin.hallId.name}
              </span>
              <button
                onClick={() => handleRemoveAllowedAdmin(admin._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Add FAQ</h3>
        <form onSubmit={handleFaqSubmit} className="space-y-2">
          <input
            type="text"
            name="question"
            placeholder="Question"
            value={newFaq.question}
            onChange={handleFaqInputChange}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            name="answer"
            placeholder="Answer"
            value={newFaq.answer}
            onChange={handleFaqInputChange}
            required
            className="w-full p-2 border rounded"
          ></textarea>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add FAQ
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">FAQs</h3>
        <ul className="space-y-4">
          {faqs.map((faq) => (
            <li key={faq._id} className="bg-gray-100 p-4 rounded">
              <h4 className="font-bold">{faq.question}</h4>
              <p>{faq.answer}</p>
              <button onClick={() => handleRemoveFaq(faq._id)} className="bg-red-500 text-white px-2 py-1 rounded mt-2">
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SuperAdminDashboard

