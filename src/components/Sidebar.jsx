import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBox, FaShoppingCart, FaClipboardList, FaUser } from "react-icons/fa";
import "../styles/Sidebar.css"; // Import the CSS file for styling

export default function Sidebar() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="sidebar">
      {/* Profile Section */}
      <div className="profile" onClick={() => navigate("/profile")}> 
        <img src="/images/profileimage.png" alt="Profile" className="profile-img" />
        <h3 className="username">User Name</h3>
      </div>

      {/* Navigation List */}
      <ul className="nav-list">
        <li>
          <Link to="/home"><FaHome /> Home</Link>
        </li>
        <li>
          <div className="nav-item" onClick={() => toggleSection("inventory")}> 
            <FaBox /> Inventory Items
          </div>
          {openSection === "inventory" && (
            <ul className="submenu">
              <li><Link to="/inventory/add">Add Item</Link></li>
              <li><Link to="/inventory/list">Item List</Link></li>
            </ul>
          )}
        </li>
        <li>
          <div className="nav-item" onClick={() => toggleSection("grocery")}> 
            <FaShoppingCart /> Grocery Items
          </div>
          {openSection === "grocery" && (
            <ul className="submenu">
              <li><Link to="/grocery/add">Add Item</Link></li>
              <li><Link to="/grocery/list">Item List</Link></li>
            </ul>
          )}
        </li>
        <li>
          <div className="nav-item" onClick={() => toggleSection("essentials")}> 
            <FaClipboardList /> Household Essentials
          </div>
          {openSection === "essentials" && (
            <ul className="submenu">
              <li><Link to="/add-essential">Add Item</Link></li>
              <li><Link to="/list-essential">Item List</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}
