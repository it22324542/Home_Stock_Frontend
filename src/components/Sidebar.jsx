import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { 
  FaBoxes, 
  FaShoppingBasket, 
  FaHome,
  FaPlus, 
  FaList 
} from "react-icons/fa";
import { 
  Container, 
  Row, 
  Col, 
  Nav, 
  Tab, 
  Card, 
  Button,
  TabContent,
  TabPane,
  Badge
} from "react-bootstrap";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inventory");

  // Sample data for demonstration
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, name: "Laptop", quantity: 5, category: "Electronics" },
    { id: 2, name: "Chair", quantity: 12, category: "Furniture" }
  ]);
  const [groceryItems, setGroceryItems] = useState([
    { id: 1, name: "Apples", quantity: 10, category: "Fruits" }
  ]);
  const [essentialItems, setEssentialItems] = useState([
    { id: 1, name: "Toilet Paper", quantity: 8, category: "Bathroom" }
  ]);

  return (
    <Container fluid className="dashboard-container p-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={3} lg={2} className="sidebar-col">
          <Sidebar />
        </Col>
        
        {/* Main Content */}
        <Col md={9} lg={10} className="main-content p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-5 fw-bold text-primary">
              <FaBoxes className="me-2" />
              Dashboard
              <Badge bg="secondary" className="ms-2">Beta</Badge>
            </h1>
          </div>
          
          {/* Tabs */}
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav variant="tabs" className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="inventory" className="d-flex align-items-center">
                  <FaBoxes className="me-2" />
                  Inventory
                  <Badge bg="primary" pill className="ms-2">
                    {inventoryItems.length}
                  </Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="grocery" className="d-flex align-items-center">
                  <FaShoppingBasket className="me-2" />
                  Grocery
                  <Badge bg="success" pill className="ms-2">
                    {groceryItems.length}
                  </Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="essentials" className="d-flex align-items-center">
                  <FaHome className="me-2" />
                  Essentials
                  <Badge bg="warning" pill className="ms-2">
                    {essentialItems.length}
                  </Badge>
                </Nav.Link>
              </Nav.Item>
            </Nav>

            {/* Tab Content */}
            <TabContent className="p-3 bg-white rounded-3 shadow-sm">
              <TabPane eventKey="inventory">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4">
                    <FaBoxes className="me-2 text-primary" />
                    Inventory Items
                  </h2>
                  <div className="d-flex">
                    <Button 
                      variant="primary"
                      className="me-2 d-flex align-items-center"
                      onClick={() => navigate("/inventory/add")}
                    >
                      <FaPlus className="me-1" />
                      Add Item
                    </Button>
                    <Button 
                      variant="outline-primary"
                      className="d-flex align-items-center"
                      onClick={() => navigate("/inventory/list")}
                    >
                      <FaList className="me-1" />
                      List Items
                    </Button>
                  </div>
                </div>
                <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {inventoryItems.map((item) => (
                    <Col key={item.id}>
                      <Card className="h-100 shadow-sm">
                        <Card.Body>
                          <Card.Title>{item.name}</Card.Title>
                          <Card.Text>
                            <span className="d-block">Quantity: {item.quantity}</span>
                            <Badge bg="info" className="mt-2">{item.category}</Badge>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>

              <TabPane eventKey="grocery">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4">
                    <FaShoppingBasket className="me-2 text-success" />
                    Grocery Items
                  </h2>
                  <div className="d-flex">
                    <Button 
                      variant="success"
                      className="me-2 d-flex align-items-center"
                      onClick={() => navigate("/grocery/add")}
                    >
                      <FaPlus className="me-1" />
                      Add Item
                    </Button>
                    <Button 
                      variant="outline-success"
                      className="d-flex align-items-center"
                      onClick={() => navigate("/grocery/list")}
                    >
                      <FaList className="me-1" />
                      List Items
                    </Button>
                  </div>
                </div>
                <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {groceryItems.map((item) => (
                    <Col key={item.id}>
                      <Card className="h-100 shadow-sm">
                        <Card.Body>
                          <Card.Title>{item.name}</Card.Title>
                          <Card.Text>
                            <span className="d-block">Quantity: {item.quantity}</span>
                            <Badge bg="info" className="mt-2">{item.category}</Badge>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>

              <TabPane eventKey="essentials">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4">
                    <FaHome className="me-2 text-warning" />
                    Household Essentials
                  </h2>
                  <div className="d-flex">
                    <Button 
                      variant="warning"
                      className="me-2 d-flex align-items-center"
                      onClick={() => navigate("/essentials/add")}
                    >
                      <FaPlus className="me-1" />
                      Add Item
                    </Button>
                    <Button 
                      variant="outline-warning"
                      className="d-flex align-items-center"
                      onClick={() => navigate("/essentials/list")}
                    >
                      <FaList className="me-1" />
                      List Items
                    </Button>
                  </div>
                </div>
                <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {essentialItems.map((item) => (
                    <Col key={item.id}>
                      <Card className="h-100 shadow-sm">
                        <Card.Body>
                          <Card.Title>{item.name}</Card.Title>
                          <Card.Text>
                            <span className="d-block">Quantity: {item.quantity}</span>
                            <Badge bg="info" className="mt-2">{item.category}</Badge>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>
            </TabContent>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;