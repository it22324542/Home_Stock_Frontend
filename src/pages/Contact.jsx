import React from "react";
//import "../styles/global.css";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 
import "../styles/Contact.css";



const Contact = () => {
  return (
    
       
    <div className="contact-container">
      <Navbar />
      
      <div className="contact-card">
        
        {/* Left Side - Contact Info */}
        <div className="contact-info">
          <h2>Contact Business Solutions Sales</h2>
          <p>Already a customer or need help with a billing issue? <a href="#">Contact Support</a></p>
          <p className="phone">📞 +1800 708 8749</p>
          <div className="contact-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="contact-form">
          <h2>Contact Us</h2>
          <p>Fill out the form and we will get back to you within 24 hours.</p>
          
          <div className="form-group">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
          </div>

          <div className="form-group">
            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Phone" />
          </div>

          <div className="form-group">
            <input type="text" placeholder="Company Name" />
            <select>
              <option>Select an Industry</option>
              <option>Construction</option>
              <option>Real Estate</option>
              <option>Manufacturing</option>
            </select>
          </div>

          <div className="form-group">
            <select>
              <option>Select Revenue</option>
              <option>Less than $100K</option>
              <option>$100K - $1M</option>
              <option>More than $1M</option>
            </select>
            <select>
              <option>Select a Country</option>
              <option>Sri Lanka</option>
              <option>USA</option>
              <option>UK</option>
            </select>
          </div>

          <div className="checkbox-group">
            <label><input type="checkbox" /> Yes, I would like to receive news and offers</label>
            <label><input type="checkbox" /> Yes, I agree to receive phone calls</label>
          </div>

          <button className="submit-btn">Submit</button>
        </div>

      </div>
      <Footer />
    </div>
    
  );
};

export default Contact;