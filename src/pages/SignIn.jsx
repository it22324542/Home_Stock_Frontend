import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for making API requests
import "./../styles/SignIn.css"; // Import the CSS file

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { email, password } = formData;

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
      // Make the POST request to your backend to sign in the user
      const response = await axios.post("http://localhost:5000/api/users/signin", formData);

      if (response.data) {
        setSuccessMessage("Login successful!");
        setShowPopup(true);
        localStorage.setItem("userToken", response.data.token); // Store the token in localStorage

        setTimeout(() => {
          setShowPopup(false);
          navigate("/dashboard"); // Redirect to the dashboard
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password.");
      setShowPopup(true);
    }
  };

  return (
    <div className="signin-container">
      {showPopup && (
        <div className={`popup-message ${error ? "error" : "success"}`}>
          {error || successMessage}
        </div>
      )}

      <div className="signin-card">
        <h2 className="signin-title">Sign In</h2>
        <form className="signin-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
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
          <button type="submit" className="signin-btn">Sign In</button>
        </form>
        <a href="/signup" className="signin-link">Don't have an account? Sign up</a>
      </div>
    </div>
  );
};

export default SignIn;
