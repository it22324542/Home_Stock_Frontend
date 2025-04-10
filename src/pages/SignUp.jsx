import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

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
      setShowPopup(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/signup", formData);

      if (response.data) {
        setSuccessMessage("Account created successfully!");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/signin");
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Server error");
      setShowPopup(true);
    }
  };

  return (
    <Container 
      fluid 
      className="d-flex justify-content-center align-items-center vh-100 p-0"
      style={{
        backgroundImage: "url('/assets/signup-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        position: "fixed",
        top: 0,
        left: 0
      }}
    >
      <Card className="p-4" style={{
        width: "400px",
        backgroundColor: "rgba(221, 120, 6, 0.15)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 15px rgba(69, 54, 4, 0.3)",
        border: "none"
      }}>
        {showPopup && (
          <Alert 
            variant={error ? "danger" : "success"} 
            onClose={() => setShowPopup(false)} 
            dismissible
            className="position-fixed top-0 end-0 m-3"
            style={{
              animation: "fadeInOut 3s ease-in-out",
              opacity: 0
            }}
          >
            {error || successMessage}
          </Alert>
        )}

        <Card.Body>
          <Card.Title className="text-center mb-4 text-white">
            <h2>Sign Up</h2>
          </Card.Title>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "none"
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "none"
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "none"
                }}
              />
            </Form.Group>

            <Button 
              variant="danger" 
              type="submit" 
              className="w-100 mb-3"
              style={{
                backgroundColor: "#f05454",
                border: "none",
                transition: "0.3s ease-in-out"
              }}
            >
              Sign Up
            </Button>
          </Form>

          <Card.Text className="text-center">
            <a 
              href="/signin" 
              className="text-white text-decoration-none"
              style={{
                transition: "0.3s"
              }}
            >
              Already have an account? Sign in
            </a>
          </Card.Text>
        </Card.Body>
      </Card>

      <style>
        {`
          .form-control:focus {
            background-color: rgba(255, 255, 255, 0.3) !important;
            box-shadow: 0 0 0 0.25rem rgba(245, 166, 35, 0.25);
            color: white !important;
          }
          
          .btn-danger:hover {
            background-color: #d43f3f !important;
            transform: scale(1.05);
          }
          
          a:hover {
            color: #ffcc00 !important;
            text-decoration: underline !important;
          }
          
          @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateY(-20px); }
            10%, 90% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Container>
  );
};

export default SignUp;