import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaFileCsv, FaFilter, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Row, Col, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';

const ReportGeneration = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [activityType, setActivityType] = useState('all');

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/login-logs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setLogs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch login logs');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all logs?')) return;
    try {
      await axios.delete('http://localhost:5000/api/users/login-logs/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDeleteStatus({
        type: 'success',
        message: 'All logs deleted successfully'
      });
      fetchLogs();
    } catch (err) {
      setDeleteStatus({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to delete all logs'
      });
    }
  };

  // Filter activities based on selections
  const filteredActivities = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    const matchesDate = (!startDate || logDate >= startDate) && (!endDate || logDate <= new Date(endDate.setHours(23, 59, 59)));
    const matchesType = activityType === 'all' || log.action === activityType;
    return matchesDate && matchesType;
  });

  // Prepare data for charts
  const prepareChartData = () => {
    const activityCounts = {};
    filteredActivities.forEach(activity => {
      const date = activity.timestamp.split('T')[0];
      activityCounts[date] = (activityCounts[date] || 0) + 1;
    });
    return Object.entries(activityCounts).map(([date, count]) => ({
      date,
      activities: count
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const handleExportPDF = () => {
    // Implement PDF export logic
    console.log('Exporting to PDF:', filteredActivities);
    alert('PDF export functionality would be implemented here');
  };

  const handleExportCSV = () => {
    if (filteredActivities.length === 0) {
      alert('No data to export');
      return;
    }
    const csvContent = [
      ['Date', 'Activity Type', 'Details'],
      ...filteredActivities.map(activity => [
        new Date(activity.timestamp).toLocaleString(),
        activity.action,
        activity.details
      ])
    ].map(e => e.map(item => `"${item}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'user_activity_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = prepareChartData();

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Report Generation</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {deleteStatus && (
        <Alert 
          variant={deleteStatus.type} 
          onClose={() => setDeleteStatus(null)} 
          dismissible
        >
          {deleteStatus.message}
        </Alert>
      )}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Login Activity Report</h4>
          <div className="d-flex align-items-center gap-2">
            <Button variant="info" size="sm" onClick={handleExportCSV}>
              <FaFileCsv className="me-1" />
              Download Report
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteAll}
              style={{ zIndex: 9999, position: 'relative', background: 'red' }}
            >
              <FaTrash className="me-1" />
              Delete All
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Filters */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  <FaCalendarAlt className="me-2" />
                  Start Date
                </Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  <FaCalendarAlt className="me-2" />
                  End Date
                </Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  <FaFilter className="me-2" />
                  Activity Type
                </Form.Label>
                <Form.Select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                >
                  <option value="all">All Activities</option>
                  <option value="login">Logins</option>
                  <option value="profile_update">Profile Updates</option>
                  <option value="settings_change">Settings Changes</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          {/* Chart */}
          <div className="mb-4" style={{ height: '300px' }}>
            <h5>Activity Overview</h5>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="activities" fill="#8884d8" name="Activities" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-4">No data available for the selected filters</div>
            )}
          </div>
          {/* Activity Table */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Activity Type</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <tr key={activity.id || activity.timestamp}>
                    <td>{new Date(activity.timestamp).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${
                        activity.type === 'login' ? 'bg-success' :
                        activity.type === 'profile_update' ? 'bg-primary' :
                        'bg-info'
                      }`}>
                        {activity.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{activity.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">No activities found for the selected filters</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportGeneration;