import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/global.css";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="about-container">
        <div className="about-content">
          <h1>About Home Stock Management</h1>
          <p>
            Welcome to <strong>Home Stock Management</strong> – your ultimate solution for 
            efficiently managing household inventory. We simplify stock tracking, reduce waste, 
            and help you stay organized like never before!
          </p>
          
          <h2>Our Mission</h2>
          <p>
            We aim to revolutionize the way households and businesses keep track of their 
            inventory by providing a **smart, efficient, and user-friendly** stock management system.
          </p>

          <h2>Why Choose Us?</h2>
          <ul>
            <li>📦 **Easy Stock Management** – Track your household items with ease.</li>
            <li>📊 **Analytics & Insights** – Get reports on usage trends and avoid unnecessary waste.</li>
            <li>🔒 **Secure & Reliable** – Your data is protected with top-tier security measures.</li>
          </ul>

          <h2>Our Team</h2>
          <p>
            Our dedicated team of developers, designers, and innovators work tirelessly to 
            bring you a seamless experience. We believe in **efficiency, innovation, and 
            customer satisfaction**.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
