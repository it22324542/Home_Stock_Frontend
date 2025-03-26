import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { 
  FaBoxes, 
  FaShoppingBasket, 
  FaHome,
  FaPlus, 
  FaList 
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inventory");

  // Sample data for demonstration
  const [inventoryItems, setInventoryItems] = useState([]);
  const [groceryItems, setGroceryItems] = useState([]);
  const [essentialItems, setEssentialItems] = useState([]);

  return (
    <div className="container-fluid min-vh-100 p-0 bg-light">
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-3">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="col-md-9 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-5 fw-bold text-primary">
              <FaBoxes className="me-2" />
              Dashboard
            </h1>
          </div>
          
          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "inventory" ? "active" : ""}`}
                onClick={() => setActiveTab("inventory")}
              >
                <FaBoxes className="me-2" />
                Inventory
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "grocery" ? "active" : ""}`}
                onClick={() => setActiveTab("grocery")}
              >
                <FaShoppingBasket className="me-2" />
                Grocery
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "essentials" ? "active" : ""}`}
                onClick={() => setActiveTab("essentials")}
              >
                <FaHome className="me-2" />
                Essentials
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content p-3 bg-white rounded-3 shadow-sm">
            {activeTab === "inventory" && (
              <div className="tab-pane fade show active">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4">
                    <FaBoxes className="me-2 text-primary" />
                    Inventory Items
                  </h2>
                  <div>
                    <button 
                      className="btn btn-primary me-2"
                      onClick={() => navigate("/inventory/add")}
                    >
                      <FaPlus className="me-1" />
                      Add Item
                    </button>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate("/inventory/list")}
                    >
                      <FaList className="me-1" />
                      List Items
                    </button>
                  </div>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {inventoryItems.map((item, index) => (
                    <div key={index} className="col">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          {item}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "grocery" && (
              <div className="tab-pane fade show active">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4">
                    <FaShoppingBasket className="me-2 text-success" />
                    Grocery Items
                  </h2>
                  <div>
                    <button 
                      className="btn btn-success me-2"
                      onClick={() => navigate("/grocery/add")}
                    >
                      <FaPlus className="me-1" />
                      Add Item
                    </button>
                    <button 
                      className="btn btn-outline-success"
                      onClick={() => navigate("/grocery/list")}
                    >
                      <FaList className="me-1" />
                      List Items
                    </button>
                  </div>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {groceryItems.map((item, index) => (
                    <div key={index} className="col">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          {item}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "essentials" && (
              <div className="tab-pane fade show active">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4">
                    <FaHome className="me-2 text-warning" />
                    Household Essentials
                  </h2>
                  <div>
                    <button 
                      className="btn btn-warning me-2"
                      onClick={() => navigate("/essentials/add")}
                    >
                      <FaPlus className="me-1" />
                      Add Item
                    </button>
                    <button 
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/essentials/list")}
                    >
                      <FaList className="me-1" />
                      List Items
                    </button>
                  </div>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {essentialItems.map((item, index) => (
                    <div key={index} className="col">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          {item}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;