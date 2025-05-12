import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const SignIn = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/users/signin", formData);
      console.log("SignIn response:", response.data); // Debug log
      
      if (response.data && response.data.user && response.data.user.token) {
        localStorage.setItem("token", response.data.user.token);
        setIsAuthenticated(true);
          navigate("/dashboard");
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error("SignIn error:", error); // Debug log
      setError(error.response?.data?.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <Card className="shadow-lg" style={{ width: "400px" }}>
        <Card.Body className="p-5">
          <h2 className="text-center mb-4">
            <FaSignInAlt className="me-2" />
            Sign In
          </h2>

          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
          </Alert>
        )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button 
              variant="primary"
              type="submit" 
              className="w-100 mb-3"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center">
              <p className="mb-0">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => navigate("/signup")}
                >
                  <FaUserPlus className="me-1" />
                  Sign Up
                </Button>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignIn;