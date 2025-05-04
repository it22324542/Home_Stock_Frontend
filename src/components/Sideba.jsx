import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBox, FaShoppingCart, FaClipboardList, FaUser } from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white" style={{ width: "280px", height: "100vh" }}>
      {/* Profile Section */}
      <div 
        className="d-flex flex-column align-items-center text-center mb-3 text-decoration-none cursor-pointer" 
        onClick={() => navigate("/profile")}
      >
        <img 
          src="/images/profileimage.png" 
          alt="Profile" 
          className="rounded-circle border border-3 border-white mb-2" 
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
        />
        <h3 className="m-0">User Name</h3>
      </div>

      <hr className="my-4" />

      {/* Navigation List */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/home" className="nav-link text-white d-flex align-items-center gap-2">
            <FaHome /> Home
          </Link>
        </li>
        
        <li className="nav-item">
          <div 
            className={`nav-link text-white d-flex align-items-center gap-2 cursor-pointer ${openSection === "inventory" ? "active" : ""}`}
            onClick={() => toggleSection("inventory")}
          >
            <FaBox /> Inventory Items
          </div>
          {openSection === "inventory" && (
            <ul className="nav flex-column ps-4 bg-secondary rounded">
              <li className="nav-item">
                <Link to="/inventory/add" className="nav-link text-white-50">Add Item</Link>
              </li>
              <li className="nav-item">
                <Link to="/inventory/list" className="nav-link text-white-50">Item List</Link>
              </li>
            </ul>
          )}
        </li>
        
        <li className="nav-item">
          <div 
            className={`nav-link text-white d-flex align-items-center gap-2 cursor-pointer ${openSection === "grocery" ? "active" : ""}`}
            onClick={() => toggleSection("grocery")}
          >
            <FaShoppingCart /> Grocery Items
          </div>
          {openSection === "grocery" && (
            <ul className="nav flex-column ps-4 bg-secondary rounded">
              <li className="nav-item">
                <Link to="/grocery/add" className="nav-link text-white-50">Add Item</Link>
              </li>
              <li className="nav-item">
                <Link to="/grocery/list" className="nav-link text-white-50">Item List</Link>
              </li>
            </ul>
          )}
        </li>
        
        <li className="nav-item">
          <div 
            className={`nav-link text-white d-flex align-items-center gap-2 cursor-pointer ${openSection === "essentials" ? "active" : ""}`}
            onClick={() => toggleSection("essentials")}
          >
            <FaClipboardList /> Household Essentials
          </div>
          {openSection === "essentials" && (
            <ul className="nav flex-column ps-4 bg-secondary rounded">
              <li className="nav-item">
                <Link to="/add-essential" className="nav-link text-white-50">Add Item</Link>
              </li>
              <li className="nav-item">
                <Link to="/list-essential" className="nav-link text-white-50">Item List</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}