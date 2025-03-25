import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
//import "../styles/global.css"; 
import "../styles/Services.css"; 

const Services = () => {
  return (
    <div className="service-page">
      <Navbar />
      <div className="service-container">
        <h2 className="service-title">
          OUR <span className="highlight">SERVICE</span>
        </h2>
        <p className="service-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultrices sapien vel quam luctus pulvinar.
        </p>
        <div className="service-grid">
          <div className="service-card">
            <i className="fas fa-box"></i>
            <h3>Stock Management</h3>
            <p>Keep track of all your home stocks efficiently and never run out of essentials.</p>
          </div>
          <div className="service-card">
            <i className="fas fa-truck"></i>
            <h3>Delivery Tracking</h3>
            <p>Monitor your deliveries in real-time and manage supply chain effectively.</p>
          </div>
          <div className="service-card">
            <i className="fas fa-receipt"></i>
            <h3>Bill Management</h3>
            <p>Store and manage your household bills securely and effortlessly.</p>
          </div>
          <div className="service-card">
            <i className="fas fa-utensils"></i>
            <h3>Grocery Planning</h3>
            <p>Plan your grocery shopping with automated stock level updates.</p>
          </div>
          <div className="service-card">
            <i className="fas fa-chart-bar"></i>
            <h3>Usage Analytics</h3>
            <p>Analyze your consumption patterns and optimize your purchases.</p>
          </div>
          <div className="service-card">
            <i className="fas fa-bell"></i>
            <h3>Expiry Notifications</h3>
            <p>Receive alerts for expiring products to minimize waste.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Services;
