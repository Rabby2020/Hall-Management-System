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
    <div className="container-fluid py-4">
      <h2 className="mb-4">Super Admin Dashboard</h2>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Add Allowed Admin</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="Admin Email"
                    value={newAllowedAdmin.email}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <select
                    name="hallId"
                    value={newAllowedAdmin.hallId}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select Hall</option>
                    {halls.map((hall) => (
                      <option key={hall._id} value={hall._id}>
                        {hall.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Add Allowed Admin
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Allowed Admins</h3>
              <ul className="list-group">
                {allowedAdmins.map((admin) => (
                  <li key={admin._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      {admin.email} - {admin.hallId.name}
                    </span>
                    <button onClick={() => handleRemoveAllowedAdmin(admin._id)} className="btn btn-danger btn-sm">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Add FAQ</h3>
              <form onSubmit={handleFaqSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="question"
                    placeholder="Question"
                    value={newFaq.question}
                    onChange={handleFaqInputChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    name="answer"
                    placeholder="Answer"
                    value={newFaq.answer}
                    onChange={handleFaqInputChange}
                    required
                    className="form-control"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Add FAQ
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">FAQs</h3>
              <div className="accordion" id="faqAccordion">
                {faqs.map((faq, index) => (
                  <div className="accordion-item" key={faq._id}>
                    <h4 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${index}`}
                        aria-expanded="false"
                        aria-controls={`collapse${index}`}
                      >
                        {faq.question}
                      </button>
                    </h4>
                    <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        <p>{faq.answer}</p>
                        <button onClick={() => handleRemoveFaq(faq._id)} className="btn btn-danger btn-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard

