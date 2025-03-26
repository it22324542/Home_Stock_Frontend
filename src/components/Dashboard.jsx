import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inventory");

  // Sample data for demonstration
  const [inventoryItems, setInventoryItems] = useState([]);
  const [groceryItems, setGroceryItems] = useState([]);
  const [essentialItems, setEssentialItems] = useState([]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="main-content">
        <h1 className="dashboard-title">Dashboard</h1>
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "inventory" ? "active" : ""}`}
            onClick={() => setActiveTab("inventory")}
          >
            Inventory
          </button>
          <button 
            className={`tab ${activeTab === "grocery" ? "active" : ""}`}
            onClick={() => setActiveTab("grocery")}
          >
            Grocery
          </button>
          <button 
            className={`tab ${activeTab === "essentials" ? "active" : ""}`}
            onClick={() => setActiveTab("essentials")}
          >
            Essentials
          </button>
        </div>

        <div className="content-container">
          {activeTab === "inventory" && (
            <div className="category-container">
              <h2>Inventory Items</h2>
              <div className="button-group">
                <button 
                  className="add-btn" 
                  onClick={() => navigate("/inventory/add")}
                >
                  Add Item
                </button>
                <button 
                  className="list-btn" 
                  onClick={() => navigate("/inventory/list")}
                >
                  List Items
                </button>
              </div>
              <div className="items-list">
                {inventoryItems.map((item, index) => (
                  <div key={index} className="item-card">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "grocery" && (
            <div className="category-container">
              <h2>Grocery Items</h2>
              <div className="button-group">
                <button 
                  className="add-btn" 
                  onClick={() => navigate("/grocery/add")}
                >
                  Add Item
                </button>
                <button 
                  className="list-btn" 
                  onClick={() => navigate("/grocery/list")}
                >
                  List Items
                </button>
              </div>
              <div className="items-list">
                {groceryItems.map((item, index) => (
                  <div key={index} className="item-card">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "essentials" && (
            <div className="category-container">
              <h2>Household Essentials</h2>
              <div className="button-group">
                <button 
                  className="add-btn" 
                  onClick={() => navigate("/essentials/add")}
                >
                  Add Item
                </button>
                <button 
                  className="list-btn" 
                  onClick={() => navigate("/essentials/list")}
                >
                  List Items
                </button>
              </div>
              <div className="items-list">
                {essentialItems.map((item, index) => (
                  <div key={index} className="item-card">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;