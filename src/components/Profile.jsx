import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import axios from "axios";
import { 
  FaUserCircle, 
  FaBell, 
  FaUserEdit,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaGlobeAmericas,
  FaSave,
  FaTimes,
  FaTrash,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaFacebook,
  FaUser,
  FaCamera,
  FaLock
} from "react-icons/fa";
import { 
  MdDashboard, 
  MdLogout,
  MdOutlineAccountCircle,
  MdOutlineVerifiedUser,
  MdWork,
  MdSchool
} from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    profilePhoto: "/images/profileimage.png",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update password");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      // Append all user data to formData
      Object.keys(user).forEach(key => {
        if (user[key] !== null && user[key] !== undefined) {
          formData.append(key, user[key]);
        }
      });

      await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleViewPublicProfile = () => {
    navigate("/profile/public");
  };

  const handleDeleteProfile = () => {
    // Add your actual delete logic here
    console.log("Profile deleted");
    // Typically you would call an API to delete the profile
    // Then redirect or show a success message
    navigate("/"); // Redirect after deletion
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <h4 className="mb-0">{user.name}</h4>
              <p className="text-muted">{user.email}</p>
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4">
                <FaUser className="me-2" />
                Profile Information
              </h5>
              {isEditing ? (
                <form onSubmit={handleProfileUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phoneNumber"
                      value={user.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      name="address"
                      value={user.address}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </form>
              ) : (
                <div>
                  <p>
                    <FaEnvelope className="me-2" />
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <FaPhone className="me-2" />
                    <strong>Phone:</strong> {user.phoneNumber || "Not provided"}
                  </p>
                  <p>
                    <FaMapMarkerAlt className="me-2" />
                    <strong>Address:</strong> {user.address || "Not provided"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">
                <FaLock className="me-2" />
                Change Password
              </h5>
              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PublicProfile = () => {
  const navigate = useNavigate();
  const [user] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
    city: "New York",
    state: "NY",
    country: "USA",
    postcode: "10001",
    profilePic: "https://via.placeholder.com/150",
    bio: "Software Engineer with 5+ years of experience building web applications. Passionate about React and Node.js.",
    jobTitle: "Senior Software Engineer",
    company: "Tech Corp Inc.",
    education: "Master's in Computer Science",
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
      github: "https://github.com/johndoe",
      facebook: "https://facebook.com/johndoe"
    }
  });

  return (
    <div className="container-fluid min-vh-100 p-0 bg-light">
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-3 bg-dark text-white p-4 vh-100 sticky-top">
          <h2 className="text-center text-white mb-4">HomeStock</h2>
          <ul className="nav nav-pills flex-column">
            <li className="nav-item mb-2">
              <button 
                className="nav-link text-white d-flex align-items-center"
                onClick={() => navigate("/dashboard")}
              >
                <MdDashboard className="me-2" />
                Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button 
                className="nav-link text-white d-flex align-items-center"
                onClick={() => navigate("/profile")}
              >
                <FaUserCircle className="me-2" />
                My Profile
              </button>
            </li>
            <li className="nav-item mb-2">
              <button 
                className="nav-link text-white d-flex align-items-center"
                onClick={() => navigate("/settings")}
              >
                <IoSettingsSharp className="me-2" />
                Settings
              </button>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link text-white d-flex align-items-center"
                onClick={() => navigate("/login")}
              >
                <MdLogout className="me-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Public Profile Content */}
        <div className="col-md-9 p-4">
          {/* Profile Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              <MdOutlineAccountCircle className="me-2" />
              Public Profile
            </h2>
            <div className="d-flex align-items-center">
              <img 
                src={user.profilePic} 
                alt="Profile" 
                className="rounded-circle border border-dark me-2" 
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
              <span>{user.firstName} {user.lastName}</span>
            </div>
          </div>

          {/* Public Profile Content */}
          <div className="row g-4">
            {/* Profile Summary Card */}
            <div className="col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <img 
                    src={user.profilePic} 
                    alt="User" 
                    className="rounded-circle border border-3 border-primary mb-3" 
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                  <h3 className="card-title">{user.firstName} {user.lastName}</h3>
                  <p className="card-text text-muted mb-1">
                    <MdWork className="me-2" />
                    {user.jobTitle} at {user.company}
                  </p>
                  <p className="card-text text-muted">
                    <MdSchool className="me-2" />
                    {user.education}
                  </p>
                  
                  <div className="d-flex justify-content-center mt-3 mb-4">
                    <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="mx-2 text-primary">
                      <FaLinkedin size={24} />
                    </a>
                    <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="mx-2 text-info">
                      <FaTwitter size={24} />
                    </a>
                    <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="mx-2 text-dark">
                      <FaGithub size={24} />
                    </a>
                    <a href={user.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="mx-2 text-primary">
                      <FaFacebook size={24} />
                    </a>
                  </div>
                  
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => navigate("/profile")}
                  >
                    <FaUserEdit className="me-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Details Card */}
            <div className="col-lg-8">
              <div className="card shadow-sm h-100">
                <div className="card-body p-4">
                  <h3 className="card-title mb-4">About</h3>
                  <p className="mb-4">{user.bio}</p>
                  
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h5 className="mb-3">
                        <FaEnvelope className="me-2" />
                        Contact Information
                      </h5>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <strong>Email:</strong> {user.email}
                        </li>
                        <li className="mb-2">
                          <strong>Phone:</strong> {user.phone}
                        </li>
                        <li className="mb-2">
                          <strong>Location:</strong> {user.city}, {user.state}, {user.country}
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h5 className="mb-3">
                        <MdWork className="me-2" />
                        Professional Information
                      </h5>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <strong>Job Title:</strong> {user.jobTitle}
                        </li>
                        <li className="mb-2">
                          <strong>Company:</strong> {user.company}
                        </li>
                        <li className="mb-2">
                          <strong>Education:</strong> {user.education}
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <h5 className="mb-3">
                    <MdOutlineVerifiedUser className="me-2" />
                    Skills
                  </h5>
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="badge bg-primary p-2">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <h5 className="mb-3">
                    <FaMapMarkerAlt className="me-2" />
                    Location
                  </h5>
                  <div className="ratio ratio-16x9">
                    <iframe 
                      src={`https://maps.google.com/maps?q=${user.city},${user.state},${user.country}&output=embed`}
                      title="User Location"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <Routes>
      <Route path="/" element={<Profile />} />
      <Route path="/public" element={<PublicProfile />} />
    </Routes>
  );
  
};

export default ProfilePage;