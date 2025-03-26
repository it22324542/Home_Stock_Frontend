import React, { useState } from "react";


import { useNavigate, Routes, Route } from "react-router-dom";
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
  FaFacebook
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
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState({...user});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleChange = (e) => {
    setTempUser({ ...tempUser, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setTempUser({...user});
    setEditMode(true);
  };

  const handleSave = () => {
    setUser({...tempUser});
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
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
  

  return (
    <div className="container-fluid min-vh-100 p-0 bg-light">
      {/* Delete Confirmation Modal */}
      <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} style={{ display: showDeleteModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Confirm Deletion</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => setShowDeleteModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to permanently delete your profile? This action cannot be undone.</p>
              <p className="fw-bold">All your data will be lost!</p>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={handleDeleteProfile}
              >
                <FaTrash className="me-2" />
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && <div className="modal-backdrop fade show"></div>}

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
                className="nav-link active bg-primary text-white d-flex align-items-center"
              >
                <FaUserCircle className="me-2" />
                Profile
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

        {/* Profile Content */}
        <div className="col-md-9 p-4">
          {/* Profile Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              <MdOutlineAccountCircle className="me-2" />
              Profile
            </h2>
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
                <FaBell className="fs-5" />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </div>
              <img 
                src={user.profilePic} 
                alt="Profile" 
                className="rounded-circle border border-dark me-2" 
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
              <span>{user.firstName} {user.lastName}</span>
            </div>
          </div>

          {/* Profile Content */}
          <div className="row g-4">
            {/* Profile Card */}
            <div className="col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <img 
                    src={user.profilePic} 
                    alt="User" 
                    className="rounded-circle border border-3 border-primary mb-3" 
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                  <h3 className="card-title">{user.firstName} {user.lastName}</h3>
                  <p className="card-text text-muted">
                    <MdOutlineVerifiedUser className="text-success me-2" />
                    {user.email}
                  </p>
                  {!editMode ? (
                    <>
                      <button 
                        className="btn btn-primary w-100 mb-2"
                        onClick={handleEdit}
                      >
                        <FaUserEdit className="me-2" />
                        Edit Profile
                      </button>
                      <button 
                        className="btn btn-outline-primary w-100 mb-2"
                        onClick={handleViewPublicProfile}
                      >
                         Profile
                      </button>
                      <button 
                        className="btn btn-outline-danger w-100"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <FaTrash className="me-2" />
                        Delete Profile
                      </button>
                    </>
                  ) : (
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-success w-100 mb-2"
                        onClick={handleSave}
                      >
                        <FaSave className="me-2" />
                        Save Changes
                      </button>
                      <button 
                        className="btn btn-outline-secondary w-100"
                        onClick={handleCancel}
                      >
                        <FaTimes className="me-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Settings Form */}
            <div className="col-lg-8">
              <div className="card shadow-sm h-100">
                <div className="card-body p-4">
                  <h3 className="card-title mb-4">
                    <IoSettingsSharp className="me-2" />
                    Account Settings
                  </h3>
                  <form>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label d-flex align-items-center">
                          <FaUserEdit className="me-2" />
                          First Name
                        </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="firstName" 
                          value={editMode ? tempUser.firstName : user.firstName} 
                          onChange={handleChange}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label d-flex align-items-center">
                          <FaUserEdit className="me-2" />
                          Last Name
                        </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="lastName" 
                          value={editMode ? tempUser.lastName : user.lastName} 
                          onChange={handleChange}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label d-flex align-items-center">
                          <FaEnvelope className="me-2" />
                          Email Address
                        </label>
                        <input 
                          type="email" 
                          className="form-control" 
                          name="email" 
                          value={editMode ? tempUser.email : user.email} 
                          onChange={handleChange}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label d-flex align-items-center">
                          <FaPhone className="me-2" />
                          Phone Number
                        </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="phone" 
                          value={editMode ? tempUser.phone : user.phone} 
                          onChange={handleChange}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label d-flex align-items-center">
                          <FaUserEdit className="me-2" />
                          Bio
                        </label>
                        <textarea 
                          className="form-control" 
                          name="bio" 
                          rows="3"
                          value={editMode ? tempUser.bio : user.bio} 
                          onChange={handleChange}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label d-flex align-items-center">
                          <FaCity className="me-2" />
                          City
                        </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="city" 
                          value={editMode ? tempUser.city : user.city} 
                          onChange={handleChange}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label d-flex align-items-center">
                          <FaGlobeAmericas className="me-2" />
                          State/County
                        </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="state" 
                          value={editMode ? tempUser.state : user.state} 
                          onChange={handleChange}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label d-flex align-items-center">
                          <FaGlobeAmericas className="me-2" />
                          Country
                        </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="country" 
                          value={editMode ? tempUser.country : user.country} 
                          onChange={handleChange}
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
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