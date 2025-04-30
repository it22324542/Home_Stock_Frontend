import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Form, Table, Alert, Spinner, Modal, InputGroup, FormControl, Dropdown, Toast, ToastContainer, Tabs, Tab } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaBarcode, FaBell, FaSearch, FaPlus, FaTrash, FaEdit, FaFilePdf, FaChartPie, FaChartBar } from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import './App.css';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const App = () => {
  const [groceries, setGroceries] = useState([]);
  const [filteredGroceries, setFilteredGroceries] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'liquid',
    quantity: '',
    expirationDate: '',
    barcode: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState({
    fetch: false,
    submit: false,
    delete: false,
    update: false,
    report: false,
    scanning: false
  });
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [expirationAlerts, setExpirationAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const videoRef = useRef(null);

  // API configuration
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Test backend connection
  const testConnection = async () => {
    try {
      await api.get('/health');
      return true;
    } catch (err) {
      console.error('Connection test failed:', err);
      return false;
    }
  };

  // Fetch all groceries
  const fetchGroceries = async () => {
    try {
      setLoading(prev => ({ ...prev, fetch: true }));
      setError('');
      
      const isConnected = await testConnection();
      if (!isConnected) {
        setConnectionStatus('disconnected');
        throw new Error('Could not connect to server');
      }
      setConnectionStatus('connected');

      const { data } = await api.get('/groceries');
      setGroceries(data.data || []);
      setFilteredGroceries(data.data || []);
      checkExpirationAlerts(data.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 
              'Failed to connect to server. Please check your backend is running.');
      setConnectionStatus('error');
      
      // Load demo data if API fails
      const demoData = [
        {
          _id: '1',
          name: 'Organic Milk',
          category: 'liquid',
          quantity: 3,
          expirationDate: new Date(Date.now() + 86400000 * 5).toISOString(),
          barcode: '123456789'
        },
        {
          _id: '2',
          name: 'Whole Grain Bread',
          category: 'dry',
          quantity: 2,
          expirationDate: new Date(Date.now() + 86400000 * 7).toISOString(),
          barcode: '987654321'
        },
        {
          _id: '3',
          name: 'Free Range Eggs',
          category: 'dairy',
          quantity: 1,
          expirationDate: new Date(Date.now() - 86400000).toISOString(),
          barcode: '456123789'
        }
      ];
      setGroceries(demoData);
      setFilteredGroceries(demoData);
      checkExpirationAlerts(demoData);
    } finally {
      setLoading(prev => ({ ...prev, fetch: false }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(prev => ({ ...prev, submit: true }));

    try {
      if (!formData.name.trim() || !formData.quantity || !formData.expirationDate) {
        throw new Error('Please fill all required fields');
      }

      const payload = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        expirationDate: new Date(formData.expirationDate).toISOString(),
        barcode: formData.barcode || null
      };

      if (editingId) {
        const { data } = await api.put(`/groceries/${editingId}`, payload);
        setGroceries(groceries.map(item => item._id === editingId ? data.data : item));
        setSuccess('Item updated successfully!');
        setEditingId(null);
      } else {
        const { data } = await api.post('/groceries', payload);
        setGroceries([...groceries, data.data]);
        setSuccess('Item added successfully!');
      }

      setFormData({
        name: '',
        category: 'liquid',
        quantity: '',
        expirationDate: '',
        barcode: ''
      });
      setScanResult('');
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 
              err.message || 
              'Failed to save item. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  // Expiration Alert System
  const checkExpirationAlerts = (items = groceries) => {
    const now = new Date();
    const alertThreshold = new Date();
    alertThreshold.setDate(now.getDate() + 7); // 7 days from now
    
    const alerts = items.filter(item => {
      if (!item.expirationDate) return false;
      const expDate = new Date(item.expirationDate);
      return expDate <= alertThreshold && expDate >= now;
    });
    
    setExpirationAlerts(alerts);
    
    if (alerts.length > 0 && !showAlerts) {
      setShowAlerts(true);
    }
  };

  // Search and Filter Functions
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setSearchFilter(filter);
    setSearchTerm('');
  };

  // Apply filters
  useEffect(() => {
    let results = [...groceries];
    
    switch(searchFilter) {
      case 'expired':
        results = results.filter(item => 
          item.expirationDate && new Date(item.expirationDate) < new Date()
        );
        break;
      case 'lowStock':
        results = results.filter(item => item.quantity < 5);
        break;
      case 'name':
        if (searchTerm.trim()) {
          results = results.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        break;
      case 'category':
        if (searchTerm.trim()) {
          results = results.filter(item => 
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        break;
      case 'barcode':
        if (searchTerm.trim()) {
          results = results.filter(item => 
            item.barcode && item.barcode.includes(searchTerm)
          );
        }
        break;
      default:
        break;
    }
    
    setFilteredGroceries(results);
  }, [groceries, searchTerm, searchFilter]);

  // Initialize filtered groceries
  useEffect(() => {
    setFilteredGroceries(groceries);
    checkExpirationAlerts(groceries);
  }, [groceries]);

  // Run expiration check every hour
  useEffect(() => {
    const interval = setInterval(() => checkExpirationAlerts(), 3600000);
    return () => clearInterval(interval);
  }, [groceries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle edit button click
  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      expirationDate: new Date(item.expirationDate).toISOString().split('T')[0],
      barcode: item.barcode || ''
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete button click
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      setLoading(prev => ({ ...prev, delete: true }));
      await api.delete(`/groceries/${itemToDelete._id}`);
      setGroceries(groceries.filter(item => item._id !== itemToDelete._id));
      setSuccess('Item deleted successfully!');
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete item. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setFormData({
      name: '',
      category: 'liquid',
      quantity: '',
      expirationDate: '',
      barcode: ''
    });
    setEditingId(null);
  };

  // Generate PDF report
  const generateReport = () => {
    setLoading(prev => ({ ...prev, report: true }));
    setError('');
    
    try {
      if (!filteredGroceries || filteredGroceries.length === 0) {
        throw new Error('No items available to generate report');
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm'
      });

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(67, 97, 238);
      doc.text('Grocery Inventory Report', 105, 20, { align: 'center' });

      // Subtitle
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });

      // Summary
      doc.setFontSize(14);
      doc.setTextColor(33, 33, 33);
      doc.text('Inventory Summary', 15, 40);

      const totalItems = filteredGroceries.length;
      const liquidItems = filteredGroceries.filter(item => item.category === 'liquid').length;
      const dairyItems = filteredGroceries.filter(item => item.category === 'dairy').length;
      const lowStockItems = filteredGroceries.filter(item => item.quantity < 5).length;
      const expiredItems = filteredGroceries.filter(item => 
        item.expirationDate && new Date(item.expirationDate) < new Date()
      ).length;

      doc.setFontSize(12);
      doc.text(`• Total Items: ${totalItems}`, 20, 50);
      doc.text(`• Liquid Items: ${liquidItems}`, 20, 58);
      doc.text(`• Dairy Items: ${dairyItems}`, 20, 66);
      doc.text(`• Low Stock Items (<5 units): ${lowStockItems}`, 20, 74);
      doc.text(`• Expired Items: ${expiredItems}`, 20, 82);

      // Table data
      const tableData = filteredGroceries.map(item => {
        const expDate = item.expirationDate ? new Date(item.expirationDate) : null;
        const today = new Date();
        const diffTime = expDate ? expDate - today : 0;
        const diffDays = expDate ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 'N/A';
        
        return [
          item.name,
          item.category.charAt(0).toUpperCase() + item.category.slice(1),
          `${item.quantity} ${item.category === 'liquid' ? 'L' : 'kg'}`,
          item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A',
          typeof diffDays === 'number' ? 
            (diffDays > 0 ? `${diffDays} days` : 'Expired') : 
            diffDays,
          item.barcode || 'N/A'
        ];
      });

      // Generate table
      autoTable(doc, {
        head: [['Name', 'Category', 'Quantity', 'Expires', 'Status', 'Barcode']],
        body: tableData,
        startY: 90,
        margin: { left: 15, right: 15 },
        styles: {
          fontSize: 10,
          cellPadding: 4,
          valign: 'middle',
          textColor: [33, 33, 33],
          font: 'helvetica'
        },
        headStyles: {
          fillColor: [67, 97, 238],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 11
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: 'bold' },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25 },
          4: { cellWidth: 20 },
          5: { cellWidth: 30 }
        },
        didDrawPage: function (data) {
          doc.setFontSize(10);
          doc.setTextColor(150);
          doc.text(
            'FreshStock Inventory System', 
            105, 
            doc.internal.pageSize.height - 10, 
            { align: 'center' }
          );
        }
      });

      doc.save(`grocery-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      setSuccess('PDF report generated successfully!');
    } catch (err) {
      console.error('Report generation error:', err);
      setError(err.message || 'Failed to generate PDF report. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, report: false }));
    }
  };

  // Get chart data function
  const getChartData = () => {
    const categories = {};
    const expirationStatus = {
      'Expired': 0,
      'Expiring Soon (≤7 days)': 0,
      'Fresh (>7 days)': 0,
      'No Date': 0
    };

    groceries.forEach(item => {
      // Count by category
      categories[item.category] = (categories[item.category] || 0) + 1;
      
      // Count by expiration status
      if (!item.expirationDate) {
        expirationStatus['No Date']++;
      } else {
        const expDate = new Date(item.expirationDate);
        const today = new Date();
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          expirationStatus['Expired']++;
        } else if (diffDays <= 7) {
          expirationStatus['Expiring Soon (≤7 days)']++;
        } else {
          expirationStatus['Fresh (>7 days)']++;
        }
      }
    });

    return {
      categories,
      expirationStatus
    };
  };

  // Pie Chart Data
  const pieChartData = {
    labels: Object.keys(getChartData().categories),
    datasets: [
      {
        data: Object.values(getChartData().categories),
        backgroundColor: [
          '#4361ee',
          '#4895ef',
          '#3f37c9',
          '#4cc9f0',
          '#f72585',
          '#f8961e'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  };

  // Bar Chart Data
  const barChartData = {
    labels: Object.keys(getChartData().expirationStatus),
    datasets: [
      {
        label: 'Items Count',
        data: Object.values(getChartData().expirationStatus),
        backgroundColor: [
          '#ef233c',
          '#f8961e',
          '#4cc9f0',
          '#6c757d'
        ],
        borderColor: '#fff',
        borderWidth: 1
      }
    ]
  };

  // Chart options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Inventory by Category',
        font: {
          size: 16
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Inventory by Expiration Status',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Initial data load
  useEffect(() => {
    fetchGroceries();
  }, []);

  return (
    <div className="grocery-app">
      <header className="app-header">
        <div className="header-content">
          <h1>FreshStock <span>Inventory</span></h1>
          <div className={`connection-status ${connectionStatus}`}>
            {connectionStatus === 'connected' ? '✓ Connected' :
             connectionStatus === 'error' ? '✗ Connection Error' :
             '⌛ Connecting...'}
          </div>
        </div>
        <div className="header-gradient"></div>
      </header>

      <main className="app-container">
        {/* Alert Notifications */}
        <ToastContainer position="top-end" className="toast-container">
          <Toast 
            show={showAlerts} 
            onClose={() => setShowAlerts(false)} 
            delay={10000} 
            autohide
            className="expiration-toast"
          >
            <Toast.Header className="toast-header">
              <FaBell className="me-2" />
              <strong className="me-auto">Expiration Alerts</strong>
              <small>{new Date().toLocaleTimeString()}</small>
            </Toast.Header>
            <Toast.Body>
              <div className="toast-alert-content">
                <div className="alert-count">{expirationAlerts.length} items expiring soon!</div>
                <ul className="alert-items">
                  {expirationAlerts.slice(0, 3).map(item => (
                    <li key={item._id} className="alert-item">
                      <span className="alert-item-name">{item.name}</span>
                      <span className="alert-item-date">expires {new Date(item.expirationDate).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Toast.Body>
          </Toast>
        </ToastContainer>

        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible className="app-alert">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" onClose={() => setSuccess('')} dismissible className="app-alert">
            {success}
          </Alert>
        )}

        <section className="grocery-form-section">
          <h2>{editingId ? 'Edit Item' : 'Add New Item'}</h2>
          <Form onSubmit={handleSubmit} className="grocery-form">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Organic Milk"
                className="form-input"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="liquid">Liquid (liters)</option>
                <option value="dairy">Dairy (kilograms)</option>
                <option value="dry">Dry Goods</option>
                <option value="frozen">Frozen</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="quantity">
              <Form.Label>Quantity *</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                min="0"
                step="0.1"
                value={formData.quantity}
                onChange={handleChange}
                required
                placeholder={
                  formData.category === 'liquid' ? 'e.g., 2.5 L' :
                  formData.category === 'dairy' ? 'e.g., 1.2 KG' :
                  'Enter quantity'
                }
                className="form-input"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="expirationDate">
              <Form.Label>Expiration Date *</Form.Label>
              <Form.Control
                type="date"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="form-input"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="barcode">
              <Form.Label>Barcode</Form.Label>
              <InputGroup>
                <FormControl
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="Enter barcode or scan"
                  className="form-input"
                />
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowScanner(true)}
                  className="scan-btn-small"
                >
                  <FaBarcode />
                </Button>
              </InputGroup>
            </Form.Group>

            <div className="form-buttons">
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading.submit || !formData.name || !formData.quantity || !formData.expirationDate}
                className="submit-btn"
              >
                {loading.submit ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" />
                    <span className="ms-2">{editingId ? 'Updating...' : 'Adding...'}</span>
                  </>
                ) : (
                  <>
                    {editingId ? (
                      <>
                        <FaEdit className="me-2" />
                        Update Item
                      </>
                    ) : (
                      <>
                        <FaPlus className="me-2" />
                        Add Item
                      </>
                    )}
                  </>
                )}
              </Button>

              {editingId && (
                <Button 
                  variant="outline-secondary" 
                  onClick={cancelEdit}
                  className="cancel-btn"
                >
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        </section>

        {/* Analytics Section */}
        <section className="analytics-section">
          <h2 className="analytics-title">
            <FaChartPie className="me-2" />
            Inventory Analytics
          </h2>
          
          <Tabs defaultActiveKey="pieChart" className="mb-3">
            <Tab eventKey="pieChart" title="Categories">
              <div className="chart-container">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </Tab>
            <Tab eventKey="barChart" title="Expiration Status">
              <div className="chart-container">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </Tab>
          </Tabs>
        </section>

        <section className="grocery-list-section">
          <div className="section-header">
            <h2>Current Inventory</h2>
            <Button 
              variant="success" 
              onClick={generateReport}
              disabled={filteredGroceries.length === 0 || loading.report}
              className="report-btn"
            >
              {loading.report ? (
                <>
                  <Spinner as="span" animation="border" size="sm" />
                  <span className="ms-2">Generating...</span>
                </>
              ) : (
                <>
                  <FaFilePdf className="me-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
          
          {loading.fetch && filteredGroceries.length === 0 ? (
            <div className="loading-spinner">
              <Spinner animation="border" variant="primary" />
              <p>Loading inventory...</p>
            </div>
          ) : filteredGroceries.length === 0 ? (
            <div className="empty-state">
              <p>No items found. {searchFilter !== 'all' ? 'Try changing your search criteria.' : 'Add your first grocery item above.'}</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="grocery-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Expires</th>
                      <th>Status</th>
                      <th>Barcode</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGroceries.map((item) => {
                      const expDate = item.expirationDate ? new Date(item.expirationDate) : null;
                      const today = new Date();
                      const diffTime = expDate ? expDate - today : 0;
                      const diffDays = expDate ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : null;
                      
                      return (
                        <tr key={item._id} className={
                          diffDays !== null && diffDays <= 3 ? 'expiring-row' : ''
                        }>
                          <td className="item-name">{item.name}</td>
                          <td className="item-category">{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</td>
                          <td className="item-quantity">
                            {item.quantity} {item.category === 'liquid' ? 'L' : 'kg'}
                            {item.quantity < 5 && (
                              <span className="low-stock-badge">Low Stock</span>
                            )}
                          </td>
                          <td className="item-expiration">
                            {expDate ? expDate.toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="item-status">
                            {diffDays === null ? 'N/A' : 
                             diffDays > 0 ? (
                              <span className="status-badge good">
                                {diffDays} day{diffDays !== 1 ? 's' : ''}
                              </span>
                             ) : (
                              <span className="status-badge expired">Expired</span>
                             )}
                          </td>
                          <td className="item-barcode">{item.barcode || 'N/A'}</td>
                          <td className="item-actions">
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              onClick={() => handleEdit(item)}
                              className="action-btn edit-btn"
                            >
                              <FaEdit />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => handleDeleteClick(item)}
                              className="action-btn delete-btn"
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              
              <div className="search-section table-search-section">
                <div className="search-controls">
                  <InputGroup className="search-input">
                    <InputGroup.Text className="search-icon">
                      <FaSearch />
                    </InputGroup.Text>
                    <FormControl
                      placeholder={
                        searchFilter === 'name' ? 'Search by name...' :
                        searchFilter === 'category' ? 'Search by category...' :
                        searchFilter === 'barcode' ? 'Search by barcode...' :
                        'Search items...'
                      }
                      value={searchTerm}
                      onChange={handleSearchChange}
                      disabled={searchFilter === 'expired' || searchFilter === 'lowStock'}
                    />
                  </InputGroup>

                  <Dropdown className="filter-dropdown">
                    <Dropdown.Toggle variant="outline" id="dropdown-filter" className="filter-toggle">
                      {searchFilter === 'all' && 'All Items'}
                      {searchFilter === 'expired' && 'Expired Items'}
                      {searchFilter === 'lowStock' && 'Low Stock Items'}
                      {searchFilter === 'name' && 'Search by Name'}
                      {searchFilter === 'category' && 'Search by Category'}
                      {searchFilter === 'barcode' && 'Search by Barcode'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="filter-menu">
                      <Dropdown.Item onClick={() => handleFilterChange('all')} className="filter-item">All Items</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleFilterChange('expired')} className="filter-item">Expired Items</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleFilterChange('lowStock')} className="filter-item">Low Stock Items</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleFilterChange('name')} className="filter-item">Search by Name</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleFilterChange('category')} className="filter-item">Search by Category</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleFilterChange('barcode')} className="filter-item">Search by Barcode</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Button 
                    variant="primary" 
                    onClick={() => setShowScanner(true)}
                    className="scan-btn"
                  >
                    <FaBarcode className="me-2" />
                    Scan Barcode
                  </Button>
                </div>

                <div className="search-info">
                  {searchFilter === 'expired' && (
                    <span className="badge expired-badge">
                      Expired: {filteredGroceries.filter(item => 
                        item.expirationDate && new Date(item.expirationDate) < new Date()
                      ).length}
                    </span>
                  )}
                  {searchFilter === 'lowStock' && (
                    <span className="badge lowstock-badge">
                      Low Stock: {filteredGroceries.filter(item => item.quantity < 5).length}
                    </span>
                  )}
                  <span className="item-count">Showing {filteredGroceries.length} of {groceries.length} items</span>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      {/* Barcode Scanner Modal */}
      <Modal show={showScanner} onHide={() => setShowScanner(false)} centered className="scanner-modal">
        <Modal.Header closeButton>
          <Modal.Title>Barcode Scanner</Modal.Title>
        </Modal.Header>
        <Modal.Body className="scanner-body">
          <div className="scanner-mockup">
            <div className="scanner-placeholder">
              <FaBarcode className="scanner-icon" />
              <p>Barcode scanner would appear here</p>
            </div>
          </div>
          <Form.Group className="manual-input">
            <Form.Label>Or enter barcode manually:</Form.Label>
            <Form.Control
              type="text"
              value={scanResult}
              onChange={(e) => setScanResult(e.target.value)}
              placeholder="Enter barcode number"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowScanner(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {
            setFormData(prev => ({ ...prev, barcode: scanResult }));
            setShowScanner(false);
          }}>
            Use This Barcode
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete <strong>{itemToDelete?.name}</strong>?</p>
          <p className="text-muted">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={loading.delete}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete}
            disabled={loading.delete}
          >
            {loading.delete ? (
              <>
                <Spinner as="span" animation="border" size="sm" />
                <span className="ms-2">Deleting...</span>
              </>
            ) : (
              <>
                <FaTrash className="me-2" />
                Delete Item
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;