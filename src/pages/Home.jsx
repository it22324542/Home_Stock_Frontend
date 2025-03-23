import React from "react";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 
import "../styles/global.css";
import "../styles/Home.css"; // Create this file for styling

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="hero">
        {/* Video Background */}
        <video autoPlay loop muted className="video-bg">
          <source src="/assets/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Content on Top of Video */}
        <div className="hero-content">
          <h1>Welcome to My Website</h1>
          <p>Your journey to something amazing starts here.</p>
          <button className="hero-btn">Get Started</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
