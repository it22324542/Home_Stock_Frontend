import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaInfoCircle, 
  FaCogs, 
  FaEnvelope, 
  FaSignInAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaBell,
  FaUser
} from "react-icons/fa";
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const navItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/about", label: "About", icon: <FaInfoCircle /> },
    { path: "/services", label: "Services", icon: <FaCogs /> },
    { path: "/contact", label: "Contact", icon: <FaEnvelope /> },
  ];

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          HomeStock
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className={`navbar-toggler-icon ${isOpen ? 'open' : ''}`} />
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link 
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  to={item.path}
                >
                  <span className="me-2">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUser />
                </Link>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <FaUser />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link 
                  className="nav-link"
                  to="/signin"
                >
                  <FaSignInAlt className="me-2" />
                  Sign In
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/notifications">
                <FaBell />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;