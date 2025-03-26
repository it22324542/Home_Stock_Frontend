import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ 
      backgroundImage: "url('/assets/home4.jpeg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed"
    }}>
      <Navbar />
      
      <div className="container my-auto py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="bg-dark bg-opacity-75 p-4 p-md-5 rounded-3 shadow-lg animate__animated animate__fadeIn">
              <h1 className="display-4 text-center mb-4" style={{ color: "#ff6200" }}>
                About Home Stock Management
              </h1>
              
              <p className="lead text-white">
                Welcome to <strong className="text-warning">Home Stock Management</strong> – your ultimate solution for 
                efficiently managing household inventory. We simplify stock tracking, reduce waste, 
                and help you stay organized like never before!
              </p>
              
              <h2 className="mt-5 mb-3" style={{ color: "#f9a825" }}>Our Mission</h2>
              <p className="text-white">
                We aim to revolutionize the way households and businesses keep track of their 
                inventory by providing a <strong className="text-warning">smart, efficient, and user-friendly</strong> stock management system.
              </p>

              <h2 className="mt-5 mb-3" style={{ color: "#f9a825" }}>Why Choose Us?</h2>
              <ul className="list-unstyled text-white">
                <li className="mb-2 d-flex align-items-start">
                  <span className="me-2" style={{ color: "#ff6200" }}>✔</span>
                  <strong className="text-warning">Easy Stock Management</strong> – Track your household items with ease.
                </li>
                <li className="mb-2 d-flex align-items-start">
                  <span className="me-2" style={{ color: "#ff6200" }}>✔</span>
                  <strong className="text-warning">Analytics & Insights</strong> – Get reports on usage trends and avoid unnecessary waste.
                </li>
                <li className="mb-2 d-flex align-items-start">
                  <span className="me-2" style={{ color: "#ff6200" }}>✔</span>
                  <strong className="text-warning">Secure & Reliable</strong> – Your data is protected with top-tier security measures.
                </li>
              </ul>

              <h2 className="mt-5 mb-3" style={{ color: "#f9a825" }}>Our Team</h2>
              <p className="text-white">
                Our dedicated team of developers, designers, and innovators work tirelessly to 
                bring you a seamless experience. We believe in <strong className="text-warning">efficiency, innovation, and 
                customer satisfaction</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;