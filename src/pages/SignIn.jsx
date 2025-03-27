import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

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
      setShowPopup(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/signin", formData);

      if (response.data) {
        setSuccessMessage("Login successful!");
        setShowPopup(true);
        localStorage.setItem("userToken", response.data.token);

        setTimeout(() => {
          setShowPopup(false);
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password.");
      setShowPopup(true);
    }
  };

  return (
    <Container 
      fluid 
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('/assets/signin-background6.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <Card className="p-4" style={{
        width: "350px",
        backgroundColor: "rgba(167, 91, 5, 0.1)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)"
      }}>
        {showPopup && (
          <Alert 
            variant={error ? "danger" : "success"} 
            onClose={() => setShowPopup(false)} 
            dismissible
            className="mt-3"
          >
            {error || successMessage}
          </Alert>
        )}

        <Card.Body>
          <Card.Title className="text-center mb-4 text-white">
            <h2>Sign In</h2>
          </Card.Title>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
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
              />
            </Form.Group>

            <Button 
              variant="danger" 
              type="submit" 
              className="w-100 mb-3"
            >
              Sign In
            </Button>
          </Form>

          <Card.Text className="text-center">
            <a href="/signup" className="text-white">
              Don't have an account? Sign up
            </a>
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignIn;