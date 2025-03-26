import React from "react";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 

const Contact = () => {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ 
      backgroundImage: "url('/assets/contact2.jpeg')",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <Navbar />
      
      <div className="container my-auto py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg overflow-hidden" style={{ 
              backgroundImage: "url('/assets/contact1.jpeg')",
              backgroundSize: "cover"
            }}>
              <div className="row g-0">
                {/* Left Side - Contact Info */}
                <div className="col-md-5 p-4" style={{
                  background: "linear-gradient(to right, #2828278d, #e8e6e420)"
                }}>
                  <div className="h-100 d-flex flex-column">
                    <h2 className="text-white mb-3">Contact Business Solutions Sales</h2>
                    <p className="text-white">
                      Already a customer or need help with a billing issue?{' '}
                      <a href="#" className="text-primary fw-bold">Contact Support</a>
                    </p>
                    <p className="text-white fs-5 my-3">
                      <i className="bi bi-telephone me-2"></i> +1800 708 8749
                    </p>
                    <div className="mt-auto">
                      <h5 className="text-white mb-3">Follow Us</h5>
                      <div>
                        <a href="#" className="text-white me-3 fs-4">
                          <i className="bi bi-facebook"></i>
                        </a>
                        <a href="#" className="text-white fs-4">
                          <i className="bi bi-instagram"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Contact Form */}
                <div className="col-md-7 p-4" style={{
                  backgroundImage: "url('/assets/contact3.jpeg')",
                  backgroundSize: "cover"
                }}>
                  <h2 className="mb-3">Contact Us</h2>
                  <p className="text-muted mb-4">
                    Fill out the form and we will get back to you within 24 hours.
                  </p>
                  
                  <form>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="First Name" 
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Last Name" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <input 
                          type="email" 
                          className="form-control" 
                          placeholder="Email" 
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Phone" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Company Name" 
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <select className="form-select" required>
                          <option value="">Select an Industry</option>
                          <option>Construction</option>
                          <option>Real Estate</option>
                          <option>Manufacturing</option>
                        </select>
                      </div>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <select className="form-select" required>
                          <option value="">Select Revenue</option>
                          <option>Less than $100K</option>
                          <option>$100K - $1M</option>
                          <option>More than $1M</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <select className="form-select" required>
                          <option value="">Select a Country</option>
                          <option>Sri Lanka</option>
                          <option>USA</option>
                          <option>UK</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="form-check mb-2">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="newsCheck" 
                        />
                        <label className="form-check-label small text-muted" htmlFor="newsCheck">
                          Yes, I would like to receive news and offers
                        </label>
                      </div>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="callsCheck" 
                        />
                        <label className="form-check-label small text-muted" htmlFor="callsCheck">
                          Yes, I agree to receive phone calls
                        </label>
                      </div>
                    </div>

                    <button className="btn btn-primary w-100 py-2" style={{ background: "#ff6600", border: "none" }}>
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;