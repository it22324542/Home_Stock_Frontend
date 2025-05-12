import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { format } from 'date-fns';

const SignInReport = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteStatus, setDeleteStatus] = useState(null);

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

  const handleDelete = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    try {
      const response = await axios.delete('http://localhost:5000/api/users/login-logs/date-range', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        data: {
          startDate,
          endDate
        }
      });

      setDeleteStatus({
        type: 'success',
        message: `Successfully deleted ${response.data.deletedCount} logs`
      });
      
      // Refresh the logs after deletion
      fetchLogs();
      
      // Clear the date inputs
      setStartDate('');
      setEndDate('');
    } catch (err) {
      setDeleteStatus({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to delete logs'
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">Login History</h2>
      
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

      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex align-items-end">
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={!startDate || !endDate}
          >
            Delete Selected Range
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Action</th>
            <th>Device</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{format(new Date(log.timestamp), 'PPpp')}</td>
              <td>{log.action}</td>
              <td>{log.device}</td>
              <td>{log.ipAddress}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SignInReport; 