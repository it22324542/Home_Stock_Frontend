import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      {/* Hero Section with Video Background */}
      <section className="position-relative vh-100 d-flex align-items-center justify-content-center overflow-hidden">
        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
          style={{ zIndex: -1 }}
        >
          <source src="/assets/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"></div>

        {/* Hero Content */}
        <div className="container text-center text-white px-3" style={{ zIndex: 1 }}>
          <h1 className="display-3 fw-bold mb-4">Welcome to HomeStock</h1>
          <p className="lead fs-3 mb-5">Your smart solution for household inventory management</p>
          
          <button 
            className="btn btn-warning btn-lg px-5 py-3 fw-bold"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Optional Features Section */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <h2 className="text-center mb-5">Why Choose Us?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="display-4 mb-3">📦</div>
                  <h3>Smart Inventory</h3>
                  <p>Track all your household items with ease</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="display-4 mb-3">📊</div>
                  <h3>Usage Analytics</h3>
                  <p>Get insights into your consumption patterns</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="display-4 mb-3">🔔</div>
                  <h3>Smart Alerts</h3>
                  <p>Never run out of essentials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;