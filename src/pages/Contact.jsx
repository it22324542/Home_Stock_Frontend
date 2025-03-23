import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/global.css";

const Contact = () => {
  return (
    <>


      <Navbar />
      {/* Hero Section */}
      
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Reach out for any inquiries or support.</p>
      </div>

      {/* Contact Info Section */}
      <div className="contact-info">
        <div className="contact-card">
          <i className="fas fa-map-marker-alt"></i>
          <h3>Our Office</h3>
          <p>500 Terry Francine Street, San Francisco, CA 94158</p>
        </div>
        <div className="contact-card">
          <i className="fas fa-envelope"></i>
          <h3>Email Us</h3>
          <p>support@homestock.com</p>
        </div>
        <div className="contact-card">
          <i className="fas fa-phone"></i>
          <h3>Call Us</h3>
          <p>123-456-7890</p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="contact-form">
        <h2>Send Us a Message</h2>
        <form>
          <div className="form-group">
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email" required />
            <input type="text" placeholder="Phone" />
          </div>
          <textarea placeholder="Your Message" rows="5"></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
