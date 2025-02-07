import { Link } from "react-router-dom"
import { getCurrentUser, logout } from "../services/auth"
import { useNavigate } from "react-router-dom"

function Navbar() {
  const user = getCurrentUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Hall Management System
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:text-blue-200">
              Home
            </Link>
          </li>
          {!user.token ? (
            <>
              <li>
                <Link to="/login" className="text-white hover:text-blue-200">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white hover:text-blue-200">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              {user.role === "admin" && (
                <li>
                  <Link to="/admin" className="text-white hover:text-blue-200">
                    Admin Dashboard
                  </Link>
                </li>
              )}
              {user.role === "system-admin" && (
                <li>
                  <Link to="/super-admin" className="text-white hover:text-blue-200">
                    Super Admin Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link to="/user" className="text-white hover:text-blue-200">
                  User Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-white hover:text-blue-200">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

