import React from "react";
import Navbar from "../components/Navbar"; // Import Navbar
import Footer from "../components/Footer"; // Import Footer
import "../styles/global.css";

const Home = () => {
  return (
    <>
      <Navbar /> {/* Add Navbar at the top */}
      <div className="hero">
        <h1>Welcome to My Website</h1>
        <p>Your journey to something amazing starts here.</p>
        <button className="hero-btn">Get Started</button>
      </div>
      <Footer /> {/* Add Footer at the bottom */}
    </>
  );
};

export default Home;
