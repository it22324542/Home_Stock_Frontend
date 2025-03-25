import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for making API requests
import "../styles/SignUp.css"; // Import the CSS file

const SignUp = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, password } = formData;

    if (name.length < 3) {
      setError("Full name must be at least 3 characters long.");
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateForm()) {
      setShowPopup(true); // Show error popup
      return;
    }

    try {
      // Make the POST request to your backend to register the user
      const response = await axios.post("http://localhost:5000/api/users/signup", formData);

      if (response.data) {
        setSuccessMessage("Account created successfully!");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/signin"); // Redirect to Sign In page after 2 seconds
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Server error");
      setShowPopup(true);
    }
  };

  return (
    <div className="signup-container">
      {showPopup && (
        <div className={`popup-message ${error ? "error" : "success"}`}>
          {error || successMessage}
        </div>
      )}

      <div className="signup-card">
        <h2 className="signup-title">Sign Up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <a href="/signin" className="signup-link">Already have an account? Sign in</a>
      </div>
    </div>
  );
};

export default SignUp;
