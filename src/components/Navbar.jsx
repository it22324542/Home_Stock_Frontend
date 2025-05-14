import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand fs-3 fw-bold" to="/">
          HomeStock
        </Link>
        
        {/* Hamburger menu for mobile */}
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

        {/* Navigation links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/services">Services</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/contact">Contact</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/signin">Sign In</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;