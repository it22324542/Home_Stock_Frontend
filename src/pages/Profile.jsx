import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePic: "",
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("phone", user.phone);
      formData.append("address", user.address);
      if (selectedFile) {
        formData.append("profilePic", selectedFile);
      }

      const response = await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUser(response.data.user);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Error updating profile.");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h2>Public Profile</h2>
        {message && <p className="message">{message}</p>}

        <div className="profile-card">
          <div className="profile-image">
            <img
              src={user.profilePic ? `http://localhost:5000${user.profilePic}` : "/default-profile.png"}
              alt="Profile"
              className="profile-img"
            />
            <input type="file" id="profilePic" onChange={handleFileChange} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={user.name} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={user.email} disabled />
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" value={user.phone} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" value={user.address} onChange={handleChange} />
            </div>

            <button type="submit" className="update-btn">Update Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
