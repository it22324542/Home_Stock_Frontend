import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Table, Alert, Spinner, Modal, InputGroup, FormControl, Toast, ToastContainer, Tabs, Tab } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaBarcode, FaBell, FaSearch, FaPlus, FaTrash, FaEdit, FaFilePdf, FaChartPie, FaChartBar, FaUndo, FaMoon, FaSun, FaFileImport, FaFileExport, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import Papa from 'papaparse';
import './App.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const LOCAL_STORAGE_KEY = 'freshstock_groceries';

const LOCATION_OPTIONS = [
  'Refrigerator',
  'Freezer',
  'Pantry',
  'Cabinet',
  'Counter',
  'Cellar',
  'Other'
];

const CATEGORY_OPTIONS = [
  'liquid',
  'dairy',
  'dry',
  'frozen'
];

const Grocery = () => {
  const [groceries, setGroceries] = useState([]);
  const [filteredGroceries, setFilteredGroceries] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'liquid',
    quantity: '',
    restockThreshold: 3,
    expirationDate: '',
    barcode: '',
    location: LOCATION_OPTIONS[0]
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState({
    fetch: false,
    submit: false,
    delete: false,
    update: false,
    report: false,
    scanning: false,
    bulkDelete: false,
    import: false,
    export: false
  });
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [expirationAlerts, setExpirationAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [locationFilter, setLocationFilter] = useState('all');

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
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.data || []));
    } catch (err) {
      setError(err.response?.data?.message ||
        'Failed to connect to server. Please check your backend is running.');
      setConnectionStatus('error');
      // Load from localStorage or demo data if API fails
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        const parsed = JSON.parse(localData);
        setGroceries(parsed);
        setFilteredGroceries(parsed);
        checkExpirationAlerts(parsed);
      } else {
        const demoData = [
          {
            _id: '1',
            name: 'Organic Milk',
            category: 'liquid',
            quantity: 2,
            restockThreshold: 3,
            expirationDate: new Date(Date.now() + 86400000 * 5).toISOString(),
            barcode: '123456789',
            location: 'Refrigerator'
          },
          {
            _id: '2',
            name: 'Whole Grain Bread',
            category: 'dry',
            quantity: 5,
            restockThreshold: 2,
            expirationDate: new Date(Date.now() + 86400000 * 7).toISOString(),
            barcode: '987654321',
            location: 'Pantry'
          },
          {
            _id: '3',
            name: 'Free Range Eggs',
            category: 'dairy',
            quantity: 1,
            restockThreshold: 2,
            expirationDate: new Date(Date.now() - 86400000).toISOString(),
            barcode: '456123789',
            location: 'Refrigerator'
          }
        ];
        setGroceries(demoData);
        setFilteredGroceries(demoData);
        checkExpirationAlerts(demoData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(demoData));
      }
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
      if (!formData.name.trim() || !formData.quantity || !formData.expirationDate || !formData.location || !formData.restockThreshold) {
        throw new Error('Please fill all required fields');
      }

      const payload = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        restockThreshold: parseInt(formData.restockThreshold),
        expirationDate: new Date(formData.expirationDate).toISOString(),
        barcode: formData.barcode || '',
        location: formData.location || LOCATION_OPTIONS[0]
      };

      if (editingId) {
        let updated;
        if (connectionStatus === 'connected') {
          const { data } = await api.put(`/groceries/${editingId}`, payload);
          updated = data.data;
        } else {
          updated = { ...payload, _id: editingId };
        }
        setGroceries(groceries.map(item => item._id === editingId ? updated : item));
        setSuccess('Item updated successfully!');
        setEditingId(null);
      } else {
        let created;
        if (connectionStatus === 'connected') {
          const { data } = await api.post('/groceries', payload);
          created = data.data;
        } else {
          created = { ...payload, _id: Date.now().toString() };
        }
        setGroceries([...groceries, created]);
        setSuccess('Item added successfully!');
      }

      setFormData({
        name: '',
        category: 'liquid',
        quantity: '',
        restockThreshold: 3,
        expirationDate: '',
        barcode: '',
        location: LOCATION_OPTIONS[0]
      });
      setScanResult('');
    } catch (err) {
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

  // Restock Alert System
  const checkRestockAlerts = (items = groceries) => {
    return items.filter(item => 
      typeof item.restockThreshold === 'number' && item.quantity <= item.restockThreshold
    );
  };

  // Search and Filter Functions
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationFilter = (e) => {
    setLocationFilter(e.target.value);
  };

  // Apply filters (search bar filters by name, category, barcode, and location)
  useEffect(() => {
    let results = [...groceries];
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      results = results.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        (item.barcode && item.barcode.includes(term))
      );
    }
    if (locationFilter !== 'all') {
      results = results.filter(item => item.location === locationFilter);
    }
    setFilteredGroceries(results);
  }, [groceries, searchTerm, locationFilter]);

  // Initialize filtered groceries
  useEffect(() => {
    setFilteredGroceries(groceries);
    checkExpirationAlerts(groceries);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(groceries));
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
      restockThreshold: item.restockThreshold || 3,
      expirationDate: new Date(item.expirationDate).toISOString().split('T')[0],
      barcode: item.barcode || '',
      location: item.location || LOCATION_OPTIONS[0]
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
      if (connectionStatus === 'connected') {
        await api.delete(`/groceries/${itemToDelete._id}`);
      }
      setGroceries(groceries.filter(item => item._id !== itemToDelete._id));
      setRecentlyDeleted(itemToDelete);
      setShowUndoToast(true);
      setSuccess('Item deleted successfully!');
      setShowDeleteModal(false);
    } catch (err) {
      setError('Failed to delete item. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  // Undo delete
  const handleUndoDelete = () => {
    if (recentlyDeleted) {
      setGroceries(prev => [...prev, recentlyDeleted]);
      setRecentlyDeleted(null);
      setShowUndoToast(false);
      setSuccess('Deletion undone.');
    }
  };

  // Bulk selection
  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredGroceries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredGroceries.map(item => item._id));
    }
  };

  // Bulk delete
  const confirmBulkDelete = async () => {
    setLoading(prev => ({ ...prev, bulkDelete: true }));
    try {
      if (connectionStatus === 'connected') {
        await Promise.all(selectedIds.map(id => api.delete(`/groceries/${id}`)));
      }
      setGroceries(groceries.filter(item => !selectedIds.includes(item._id)));
      setSuccess('Selected items deleted.');
      setSelectedIds([]);
      setShowBulkDeleteModal(false);
    } catch (err) {
      setError('Bulk delete failed.');
    } finally {
      setLoading(prev => ({ ...prev, bulkDelete: false }));
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setFormData({
      name: '',
      category: 'liquid',
      quantity: '',
      restockThreshold: 3,
      expirationDate: '',
      barcode: '',
      location: LOCATION_OPTIONS[0]
    });
    setEditingId(null);
  };

  // Generate PDF report (now includes location and restock)
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

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(67, 97, 238);
      doc.text('Grocery Inventory Report', 105, 20, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });

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
      const restockItems = filteredGroceries.filter(item => item.quantity <= item.restockThreshold).length;

      doc.setFontSize(12);
      doc.text(`• Total Items: ${totalItems}`, 20, 50);
      doc.text(`• Liquid Items: ${liquidItems}`, 20, 58);
      doc.text(`• Dairy Items: ${dairyItems}`, 20, 66);
      doc.text(`• Low Stock Items (<5 units): ${lowStockItems}`, 20, 74);
      doc.text(`• Expired Items: ${expiredItems}`, 20, 82);
      doc.text(`• Items Needing Restock: ${restockItems}`, 20, 90);

      const tableData = filteredGroceries.map(item => {
        const expDate = item.expirationDate ? new Date(item.expirationDate) : null;
        const today = new Date();
        const diffTime = expDate ? expDate - today : 0;
        const diffDays = expDate ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 'N/A';
        return [
          item.name,
          item.category.charAt(0).toUpperCase() + item.category.slice(1),
          `${item.quantity} ${item.category === 'liquid' ? 'L' : 'kg'}`,
          item.location || 'N/A',
          item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A',
          typeof diffDays === 'number' ?
            (diffDays > 0 ? `${diffDays} days` : 'Expired') :
            diffDays,
          item.barcode || 'N/A',
          item.restockThreshold || 'N/A',
          item.quantity <= item.restockThreshold ? 'Restock Needed' : 'OK'
        ];
      });

      autoTable(doc, {
        head: [['Name', 'Category', 'Quantity', 'Location', 'Expires', 'Status', 'Barcode', 'Restock Threshold', 'Restock Status']],
        body: tableData,
        startY: 100,
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
          4: { cellWidth: 25 },
          5: { cellWidth: 20 },
          6: { cellWidth: 30 },
          7: { cellWidth: 20 },
          8: { cellWidth: 25 }
        },
        didDrawPage: function () {
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
      setError(err.message || 'Failed to generate PDF report. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, report: false }));
    }
  };

  // CSV Export (now includes location and restockThreshold)
  const handleExportCSV = () => {
    setLoading(prev => ({ ...prev, export: true }));
    try {
      const csv = Papa.unparse(filteredGroceries.map(item => ({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        expirationDate: item.expirationDate,
        barcode: item.barcode,
        location: item.location,
        restockThreshold: item.restockThreshold
      })));
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `grocery-inventory-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSuccess('CSV exported.');
    } catch (err) {
      setError('Export failed.');
    } finally {
      setLoading(prev => ({ ...prev, export: false }));
    }
  };

  // CSV Import (now includes location and restockThreshold)
  const handleImportCSV = (e) => {
    setLoading(prev => ({ ...prev, import: true }));
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const imported = results.data
          .filter(row => row.name && row.quantity && row.expirationDate)
          .map(row => ({
            _id: Date.now().toString() + Math.random().toString(36).slice(2),
            name: row.name,
            category: row.category || 'liquid',
            quantity: parseFloat(row.quantity),
            expirationDate: row.expirationDate,
            barcode: row.barcode || '',
            location: row.location || LOCATION_OPTIONS[0],
            restockThreshold: row.restockThreshold ? parseInt(row.restockThreshold) : 3
          }));
        setGroceries(prev => [...prev, ...imported]);
        setSuccess('CSV imported.');
        setLoading(prev => ({ ...prev, import: false }));
      },
      error: () => {
        setError('Import failed.');
        setLoading(prev => ({ ...prev, import: false }));
      }
    });
  };

  // Get chart data function (location analytics + restock)
  const getChartData = () => {
    const categories = {};
    const expirationStatus = {
      'Expired': 0,
      'Expiring Soon (≤7 days)': 0,
      'Fresh (>7 days)': 0,
      'No Date': 0
    };
    const locations = {};
    let restockNeeded = 0;
    let restockOk = 0;

    groceries.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
      locations[item.location || 'Unspecified'] = (locations[item.location || 'Unspecified'] || 0) + 1;
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
      if (typeof item.restockThreshold === 'number' && item.quantity <= item.restockThreshold) {
        restockNeeded++;
      } else {
        restockOk++;
      }
    });

    return {
      categories,
      expirationStatus,
      locations,
      restockStatus: {
        'Needs Restock': restockNeeded,
        'Adequate Stock': restockOk
      }
    };
  };

  // Pie Chart Data (by category)
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

  // Bar Chart Data (by expiration)
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

  // Pie Chart Data (by location)
  const locationChartData = {
    labels: Object.keys(getChartData().locations),
    datasets: [
      {
        data: Object.values(getChartData().locations),
        backgroundColor: [
          '#1b9aaa',
          '#d7263d',
          '#77cbb9',
          '#f46036',
          '#2e294e',
          '#e2c044',
          '#6e44ff'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  };

  // Pie Chart Data (Restock Status)
  const restockChartData = {
    labels: Object.keys(getChartData().restockStatus),
    datasets: [
      {
        data: Object.values(getChartData().restockStatus),
        backgroundColor: [
          '#ef233c',
          '#4cc9f0'
        ],
        borderColor: '#fff',
        borderWidth: 2
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

  const locationChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Inventory by Storage Location',
        font: {
          size: 16
        }
      }
    }
  };

  const restockChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Restock Status',
        font: {
          size: 16
        }
      }
    }
  };

  // Initial data load
  useEffect(() => {
    fetchGroceries();
  }, []);

  // Dark mode toggle
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <div className={`grocery-app${darkMode ? ' dark' : ''}`}>
      <header className="app-header">
        <div className="header-content">
          <h1>GROCERY <span>Management..</span></h1>
          <div className={`connection-status ${connectionStatus}`}>
            {connectionStatus === 'connected' ? '✓ Connected' :
              connectionStatus === 'error' ? '✗ Connection Error' :
                '⌛ Connecting...'}
          </div>
          <Button
            aria-label="Toggle dark mode"
            variant="outline-secondary"
            className="darkmode-toggle"
            onClick={() => setDarkMode(d => !d)}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </Button>
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
          <Toast
            show={showUndoToast}
            onClose={() => setShowUndoToast(false)}
            delay={7000}
            autohide
            className="undo-toast"
            bg="info"
          >
            <Toast.Header>
              <FaUndo className="me-2" />
              <strong className="me-auto">Undo Delete</strong>
            </Toast.Header>
            <Toast.Body>
              <span>Item deleted.</span>
              <Button
                variant="link"
                className="ms-2 p-0"
                onClick={handleUndoDelete}
                aria-label="Undo delete"
              >
                Undo
              </Button>
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

        {/* Add New Item Form */}
        <section className="grocery-form-section modern-form">
        <h2>
          <span role="img" aria-label="add">➕</span> Add New Item
        </h2>
        <Form onSubmit={handleSubmit} className="grocery-form" aria-label="Grocery form">
          <div className="form-grid">
            <Form.Group>
              <Form.Label>Name *</Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Organic Milk" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category *</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange}>
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Quantity *</Form.Label>
              <Form.Control name="quantity" type="number" min="0" step="0.1" value={formData.quantity} onChange={handleChange} required placeholder="e.g. 2" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Restock Threshold *</Form.Label>
              <Form.Control name="restockThreshold" type="number" min="1" step="1" value={formData.restockThreshold} onChange={handleChange} required placeholder="e.g. 3" />
              <Form.Text className="text-muted">Reminder when quantity is at or below this value.</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Expiration Date *</Form.Label>
              <Form.Control name="expirationDate" type="date" value={formData.expirationDate} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Storage Location *</Form.Label>
              <Form.Select name="location" value={formData.location} onChange={handleChange} required>
                {LOCATION_OPTIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Barcode</Form.Label>
              <InputGroup>
                <FormControl name="barcode" value={formData.barcode} onChange={handleChange} placeholder="Optional" />
                <Button variant="outline-secondary"><FaBarcode /></Button>
              </InputGroup>
            </Form.Group>
          </div>
          <div className="form-buttons">
            <Button type="submit" variant="primary" className="submit-btn">
              <FaPlus className="me-2" />
              {editingId ? 'Update' : 'Add'}
            </Button>
            {editingId && (
              <Button variant="outline-secondary" className="cancel-btn" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
            <label htmlFor="csv-import" className="btn btn-outline-secondary me-2" aria-label="Import CSV">
              <FaFileImport className="me-1" /> Import CSV
              <input
                id="csv-import"
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleImportCSV}
                disabled={loading.import}
              />
            </label>
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
            <Tab eventKey="locationChart" title="Storage Locations">
              <div className="chart-container">
                <Pie data={locationChartData} options={locationChartOptions} />
              </div>
            </Tab>
            <Tab eventKey="restockChart" title="Restock Status">
              <div className="chart-container">
                <Pie data={restockChartData} options={restockChartOptions} />
              </div>
            </Tab>
          </Tabs>
        </section>

        {/* Inventory Table */}
        <section className="grocery-list-section">
          <div className="section-header">
            <h2>Current Inventory</h2>
            <div>
              <Button
                variant="danger"
                className="me-2"
                onClick={() => setShowBulkDeleteModal(true)}
                disabled={selectedIds.length === 0 || loading.bulkDelete}
                aria-label="Bulk delete"
              >
                <FaTrash className="me-1" />
                Bulk Delete
              </Button>
              <Button
                variant="success"
                onClick={generateReport}
                disabled={filteredGroceries.length === 0 || loading.report}
                className="report-btn me-2"
                aria-label="Generate PDF report"
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
              <Button
                variant="outline-secondary"
                onClick={handleExportCSV}
                disabled={filteredGroceries.length === 0 || loading.export}
                aria-label="Export CSV"
              >
                <FaFileExport className="me-1" /> Export CSV
              </Button>
            </div>
          </div>
          {/* --- Search Bar and Location Filter --- */}
          <div className="inventory-searchbar" style={{ maxWidth: 320, marginBottom: 20 }}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <FormControl
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search inventory"
              />
            </InputGroup>
          </div>
          <div className="location-filter" style={{ maxWidth: 220, marginBottom: 20 }}>
            <InputGroup>
              <InputGroup.Text>
                <FaMapMarkerAlt />
              </InputGroup.Text>
              <Form.Select value={locationFilter} onChange={handleLocationFilter} aria-label="Filter by location">
                <option value="all">All Locations</option>
                {LOCATION_OPTIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </Form.Select>
            </InputGroup>
          </div>
          {/* --- End Search Bar and Location Filter --- */}

          <div className="table-responsive">
            <Table hover className="grocery-table" aria-label="Grocery inventory table">
              <thead>
                <tr>
                  <th>
                    <Form.Check
                      type="checkbox"
                      aria-label="Select all"
                      checked={selectedIds.length === filteredGroceries.length && filteredGroceries.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Restock Threshold</th>
                  <th>Location</th>
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
                  const needsRestock = typeof item.restockThreshold === 'number' && item.quantity <= item.restockThreshold;

                  return (
                    <tr key={item._id} className={
                      (diffDays !== null && diffDays <= 3 ? 'expiring-row ' : '') +
                      (needsRestock ? 'restock-row' : '')
                    }>
                      <td>
                        <Form.Check
                          type="checkbox"
                          aria-label={`Select ${item.name}`}
                          checked={selectedIds.includes(item._id)}
                          onChange={() => handleSelect(item._id)}
                        />
                      </td>
                      <td className="item-name">{item.name}</td>
                      <td className="item-category">{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</td>
                      <td className="item-quantity">
                        {item.quantity} {item.category === 'liquid' ? 'L' : 'kg'}
                        {needsRestock && (
                          <span className="restock-badge ms-2">
                            <FaExclamationTriangle /> Restock Needed
                          </span>
                        )}
                      </td>
                      <td className="item-restock">{item.restockThreshold}</td>
                      <td className="item-location">{item.location || 'N/A'}</td>
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
                          aria-label={`Edit ${item.name}`}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(item)}
                          className="action-btn delete-btn"
                          aria-label={`Delete ${item.name}`}
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
        </section>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="delete-modal" aria-labelledby="delete-modal-title">
          <Modal.Header closeButton>
            <Modal.Title id="delete-modal-title">Confirm Deletion</Modal.Title>
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

        {/* Bulk Delete Modal */}
        <Modal show={showBulkDeleteModal} onHide={() => setShowBulkDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Bulk Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete <strong>{selectedIds.length}</strong> selected items?</p>
            <p className="text-muted">This action cannot be undone.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => setShowBulkDeleteModal(false)}
              disabled={loading.bulkDelete}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmBulkDelete}
              disabled={loading.bulkDelete}
            >
              {loading.bulkDelete ? (
                <>
                  <Spinner as="span" animation="border" size="sm" />
                  <span className="ms-2">Deleting...</span>
                </>
              ) : (
                <>
                  <FaTrash className="me-2" />
                  Delete Selected
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
};

export default Grocery;
