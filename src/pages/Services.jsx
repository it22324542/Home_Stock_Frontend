import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  FaBox, 
  FaTruck, 
  FaReceipt, 
  FaUtensils, 
  FaChartBar, 
  FaBell 
} from "react-icons/fa";

const Services = () => {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ 
      backgroundImage: "url('/assets/price.jpeg')",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <Navbar />
      
      <div className="container my-5 py-4">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold mb-3">
            OUR <span className="text-warning">SERVICES</span>
          </h2>
          <p className="lead text-white-50">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultrices sapien vel quam luctus pulvinar.
          </p>
        </div>

        <div className="row g-4">
          {/* Service Card 1 */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-lg bg-gradient bg-orange text-dark p-4 service-card-hover">
              <div className="card-body text-center">
                <FaBox className="display-4 mb-3 text-success" />
                <h3 className="card-title fw-bold">Stock Management</h3>
                <p className="card-text">
                  Keep track of all your home stocks efficiently and never run out of essentials.
                </p>
              </div>
            </div>
          </div>

          {/* Service Card 2 */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-lg bg-gradient bg-orange text-dark p-4 service-card-hover">
              <div className="card-body text-center">
                <FaTruck className="display-4 mb-3 text-success" />
                <h3 className="card-title fw-bold">Delivery Tracking</h3>
                <p className="card-text">
                  Monitor your deliveries in real-time and manage supply chain effectively.
                </p>
              </div>
            </div>
          </div>

          {/* Service Card 3 */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-lg bg-gradient bg-orange text-dark p-4 service-card-hover">
              <div className="card-body text-center">
                <FaReceipt className="display-4 mb-3 text-success" />
                <h3 className="card-title fw-bold">Bill Management</h3>
                <p className="card-text">
                  Store and manage your household bills securely and effortlessly.
                </p>
              </div>
            </div>
          </div>

          {/* Service Card 4 */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-lg bg-gradient bg-orange text-dark p-4 service-card-hover">
              <div className="card-body text-center">
                <FaUtensils className="display-4 mb-3 text-success" />
                <h3 className="card-title fw-bold">Grocery Planning</h3>
                <p className="card-text">
                  Plan your grocery shopping with automated stock level updates.
                </p>
              </div>
            </div>
          </div>

          {/* Service Card 5 */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-lg bg-gradient bg-orange text-dark p-4 service-card-hover">
              <div className="card-body text-center">
                <FaChartBar className="display-4 mb-3 text-success" />
                <h3 className="card-title fw-bold">Usage Analytics</h3>
                <p className="card-text">
                  Analyze your consumption patterns and optimize your purchases.
                </p>
              </div>
            </div>
          </div>

          {/* Service Card 6 */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-lg bg-gradient bg-orange text-dark p-4 service-card-hover">
              <div className="card-body text-center">
                <FaBell className="display-4 mb-3 text-success" />
                <h3 className="card-title fw-bold">Expiry Notifications</h3>
                <p className="card-text">
                  Receive alerts for expiring products to minimize waste.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Services;