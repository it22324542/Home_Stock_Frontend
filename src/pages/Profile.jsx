import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/Profile.css";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { MdDashboard, MdLogout } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";

const Profile = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
    city: "New York",
    state: "NY",
    country: "USA",
    postcode: "10001",
    profilePic: "https://via.placeholder.com/150",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("User logged out");
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">HomeStock</h2>
        <ul>
          <li onClick={() => navigate("/dashboard")}>
            <MdDashboard className="icon" />
            Dashboard
          </li>
          <li className="active" onClick={() => navigate("/profile")}>
            <FaUserCircle className="icon" />
            Profile
          </li>
          <li onClick={() => navigate("/settings")}>
            <IoSettingsSharp className="icon" />
            Settings
          </li>
          <li onClick={handleLogout}>
            <MdLogout className="icon" />
            Logout
          </li>
        </ul>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <h2>Profile</h2>
          <div className="user-info">
            <FaBell className="notification-icon" />
            <img src={user.profilePic} alt="Profile" className="profile-pic" />
            <span>{user.firstName} {user.lastName}</span>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="profile-section">
          <div className="profile-card">
            <img src={user.profilePic} alt="User" className="profile-img" />
            <h3>{user.firstName} {user.lastName}</h3>
            <p>{user.email}</p>
            <button className="view-profile-btn">View Public Profile</button>
          </div>

          {/* Account Settings Form */}
          <div className="account-settings">
            <h3>Account Settings</h3>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={user.firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={user.lastName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={user.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" value={user.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={user.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>State/County</label>
              <input type="text" name="state" value={user.state} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" value={user.country} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Postcode</label>
              <input type="text" name="postcode" value={user.postcode} onChange={handleChange} />
            </div>
            <button className="update-btn">Update</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;