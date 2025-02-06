import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminDashboard from "./pages/AdminDashboard"
import UserDashboard from "./pages/UserDashboard"
import { getCurrentUser } from "./services/auth"

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = getCurrentUser()
  console.log("Current user:", user)
  if (!user.token) {
    return <Navigate to="/login" />
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("User role not allowed:", user.role)
    return <Navigate to="/" />
  }
  return children
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/user"
            element={
              <PrivateRoute allowedRoles={["student"]}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App