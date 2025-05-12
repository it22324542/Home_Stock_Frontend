import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Alert } from 'react-bootstrap';
import axios from 'axios';
import SignInReport from '../components/SignInReport';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch profile data');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Tab.Container defaultActiveKey="profile">
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="profile">Profile Information</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="login-history">Login History</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="profile">
                {user && (
                  <Card>
                    <Card.Body>
                      <Row>
                        <Col md={4}>
                          {user.photo ? (
                            <img
                              src={user.photo}
                              alt="Profile"
                              className="img-fluid rounded-circle mb-3"
                              style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              className="rounded-circle bg-secondary mb-3 d-flex align-items-center justify-content-center"
                              style={{ width: '200px', height: '200px' }}
                            >
                              <span className="text-white h1">
                                {user.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </Col>
                        <Col md={8}>
                          <h3>{user.name}</h3>
                          <p className="text-muted">{user.email}</p>
                          <p>
                            <strong>Role:</strong> {user.role}
                          </p>
                          <p>
                            <strong>Member Since:</strong>{' '}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="login-history">
                <SignInReport />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 