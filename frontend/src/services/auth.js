import axios from "axios"

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common["Authorization"]
  }
}

export const login = async (email, password) => {
  try {
    const res = await axios.post("/api/auth/login", { email, password })
    localStorage.setItem("token", res.data.token)
    localStorage.setItem("userId", res.data.userId)
    localStorage.setItem("role", res.data.role)
    localStorage.setItem("hallId", res.data.hallId)
    setAuthToken(res.data.token)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("userId")
  localStorage.removeItem("role")
  localStorage.removeItem("hallId")
  setAuthToken(null)
}

export const getCurrentUser = () => {
  return {
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
    role: localStorage.getItem("role"),
    hallId: localStorage.getItem("hallId"),
  }
}

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null
}

