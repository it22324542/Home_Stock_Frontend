import React from "react";
import { FaCrown, FaGem, FaStar, FaCheckCircle, FaBolt, FaInfinity } from "react-icons/fa";

const Pricing = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 py-5 bg-dark text-white">
      {/* Animated Header */}
      <div className="text-center mb-5 animate__animated animate__fadeInDown">
        <h1 className="display-3 fw-bold text-gradient mb-3">
          Choose Your Perfect Plan
        </h1>
        <p className="lead text-muted">
          Upgrade your experience with our premium features
        </p>
      </div>

      <div className="container">
        <div className="row g-4 justify-content-center">
          {/* Free Plan */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-lg bg-gradient bg-light text-dark overflow-hidden">
              <div className="card-body p-4 position-relative">
                <div className="text-center py-4">
                  <FaStar className="display-4 text-warning mb-3" />
                  <h3 className="card-title fw-bold display-6">Starter</h3>
                  <div className="d-flex justify-content-center align-items-baseline my-4">
                    <span className="h3 fw-bold">$0</span>
                    <span className="text-muted ms-2">/month</span>
                  </div>
                </div>
                <ul className="list-unstyled mb-4">
                  <li className="mb-3 d-flex align-items-center">
                    <FaCheckCircle className="text-success me-2" />
                    <span>150 Fast Tokens (Daily Reset)</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <FaCheckCircle className="text-success me-2" />
                    <span>1 Collection</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <FaCheckCircle className="text-success me-2" />
                    <span>200 Realtime Actions</span>
                  </li>
                </ul>
                <button className="btn btn-outline-dark w-100 py-2 fw-bold mt-auto">
                  Get Started
                </button>
              </div>
            </div>
          </div>

          {/* Premium Plan - Highlighted */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-lg bg-gradient bg-warning text-dark overflow-hidden position-relative">
              {/* Popular Badge */}
              <div className="position-absolute top-0 end-0 bg-danger text-white px-3 py-1 rounded-bl">
                Most Popular
              </div>
              <div className="card-body p-4">
                <div className="text-center py-4">
                  <FaCrown className="display-4 text-dark mb-3" />
                  <h3 className="card-title fw-bold display-6">Professional</h3>
                  <div className="d-flex justify-content-center align-items-baseline my-4">
                    <span className="h1 fw-bold">$10</span>
                    <span className="text-muted ms-2">/month</span>
                  </div>
                </div>
                <ul className="list-unstyled mb-4">
                  <li className="mb-3 d-flex align-items-center">
                    <FaBolt className="text-dark me-2" />
                    <span>8,500 Fast Tokens (Monthly)</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <FaInfinity className="text-dark me-2" />
                    <span>Unlimited Collections</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <FaInfinity className="text-dark me-2" />
                    <span>Unlimited Realtime Actions</span>
                  </li>
                </ul>
                <button className="btn btn-dark w-100 py-3 fw-bold mt-auto">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-lg bg-gradient bg-primary text-white overflow-hidden">
              <div className="card-body p-4">
                <div className="text-center py-4">
                  <FaGem className="display-4 text-white mb-3" />
                  <h3 className="card-title fw-bold display-6">Enterprise</h3>
                  <div className="d-flex justify-content-center align-items-baseline my-4">
                    <span className="h1 fw-bold">$24</span>
                    <span className="text-white-50 ms-2">/month</span>
                  </div>
                </div>
                <ul className="list-unstyled mb-4">
                  <li className="mb-3 d-flex align-items-center">
                    <FaBolt className="text-white me-2" />
                    <span>25,000 Fast Tokens</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <FaInfinity className="text-white me-2" />
                    <span>Unlimited Realtime Actions</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <FaInfinity className="text-white me-2" />
                    <span>Unlimited Collections</span>
                  </li>
                </ul>
                <button className="btn btn-light w-100 py-3 fw-bold mt-auto text-primary">
                  Get Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="text-center mt-5 p-4 bg-dark bg-opacity-50 rounded-3">
        <h4 className="fw-bold mb-3">Not sure which plan is right for you?</h4>
        <button className="btn btn-outline-light px-4">
          Contact Our Sales Team
        </button>
      </div>
    </div>
  );
};

export default Pricing;