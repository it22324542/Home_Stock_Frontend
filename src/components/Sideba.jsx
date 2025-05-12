import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBox, FaShoppingCart, FaClipboardList, FaUser } from "react-icons/fa";
import axios from "axios";

export default function Sidebar() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);
  const [user, setUser] = useState({
    name: "Loading...",
    profilePhoto: "/images/profileimage.png"
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser({
          name: response.data.name,
          profilePhoto: response.data.profilePhoto || "/images/profileimage.png"
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/signin");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white" style={{ width: "280px", height: "100vh" }}>
      {/* Profile Section */}
      <div 
        className="d-flex flex-column align-items-center text-center mb-3 text-decoration-none cursor-pointer profile-section" 
        onClick={handleProfileClick}
        style={{ 
          cursor: "pointer",
          transition: "all 0.3s ease",
          padding: "10px",
          borderRadius: "10px"
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
      >
        <img 
          src={user.profilePhoto} 
          alt="Profile" 
          className="rounded-circle border border-3 border-white mb-2" 
          style={{ 
            width: "80px", 
            height: "80px", 
            objectFit: "cover",
            transition: "transform 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        />
        <h3 className="m-0">{user.name}</h3>
        <small className="text-white-50">Click to view profile</small>
      </div>

      <hr className="my-4" />

      {/* Navigation List */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/" className="nav-link text-white d-flex align-items-center gap-2">
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
                <Link to="/inventory/list" className="nav-link text-white-50">View Items</Link>
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
                <Link to="/grocery/list" className="nav-link text-white-50">View Items</Link>
              </li>
            </ul>
          )}
        </li>
        
        <li className="nav-item">
          <div 
            className={`nav-link text-white d-flex align-items-center gap-2 cursor-pointer ${openSection === "essentials" ? "active" : ""}`}
            onClick={() => toggleSection("essentials")}
          >
            <FaClipboardList /> Essential Items
          </div>
          {openSection === "essentials" && (
            <ul className="nav flex-column ps-4 bg-secondary rounded">
              <li className="nav-item">
                <Link to="/essentials/add" className="nav-link text-white-50">Add Item</Link>
              </li>
              <li className="nav-item">
                <Link to="/essentials/list" className="nav-link text-white-50">View Items</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}