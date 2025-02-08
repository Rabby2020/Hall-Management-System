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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Hall Management System
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            {!user.token ? (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link to="/admin" className="nav-link">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                {user.role === "system-admin" && (
                  <li className="nav-item">
                    <Link to="/super-admin" className="nav-link">
                      Super Admin Dashboard
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link to="/user" className="nav-link">
                    User Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link btn btn-link">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

