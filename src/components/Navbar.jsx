import React from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="logo">HomeStock</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
