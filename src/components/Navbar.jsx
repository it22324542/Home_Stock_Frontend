import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaInfoCircle, FaCogs, FaEnvelope, FaSignInAlt } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/about", label: "About", icon: <FaInfoCircle /> },
    { path: "/services", label: "Services", icon: <FaCogs /> },
    { path: "/contact", label: "Contact", icon: <FaEnvelope /> },
    { path: "/signin", label: "Sign In", icon: <FaSignInAlt /> }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ 
          fontSize: '1.8rem',
          fontWeight: '700',
          color: '#ffffff',
          textShadow: '0 0 10px rgba(0,180,216,0.5)'
        }}>
          HomeStock
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className={`navbar-toggler-icon ${isOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link 
                  className={`nav-link d-flex align-items-center px-3 py-2 mx-2 rounded-pill ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                  to={item.path}
                  style={{
                    transition: 'all 0.3s ease',
                    color: location.pathname === item.path ? '#ffffff' : 'rgba(255,255,255,0.9)',
                    background: location.pathname === item.path 
                      ? 'linear-gradient(45deg, #00b4d8, #48cae4)' 
                      : 'transparent',
                    fontWeight: location.pathname === item.path ? '600' : '500',
                    textShadow: location.pathname === item.path ? '0 0 5px rgba(0,180,216,0.5)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.color = '#ffffff';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.textShadow = '0 0 5px rgba(0,180,216,0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.color = 'rgba(255,255,255,0.9)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.textShadow = 'none';
                    }
                  }}
                >
                  <span className="me-2" style={{ color: location.pathname === item.path ? '#ffffff' : 'rgba(255,255,255,0.9)' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .navbar-toggler-icon {
          transition: transform 0.3s ease;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 0.9)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }
        .navbar-toggler-icon.open {
          transform: rotate(90deg);
        }
        .nav-link {
          position: relative;
          overflow: hidden;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(45deg, #00b4d8, #48cae4);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-link:hover::after {
          width: 80%;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;