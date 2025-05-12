import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDownload, FaTrash } from 'react-icons/fa';

const LoginReport = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteStatus, setDeleteStatus] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (deleteStatus) {
      const timer = setTimeout(() => setDeleteStatus(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteStatus]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/users/login-logs', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setLogs(response.data);
      } else {
        setLogs([]);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err.response?.data?.message || 'Failed to fetch login logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (logs.length === 0) {
      setError('No data to download');
      return;
    }

    try {
      const headers = ['Date', 'Time', 'Action'];
      const csvContent = [
        headers.join(','),
        ...logs.map(log => [
          new Date(log.timestamp).toLocaleDateString(),
          new Date(log.timestamp).toLocaleTimeString(),
          log.action
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `login-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to generate download file');
    }
  };

  const handleDeleteByRange = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setDeleteStatus('Please select both start and end dates.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete logs in this range?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete('http://localhost:5000/api/users/login-logs/date-range', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { startDate, endDate }
      });
      setDeleteStatus(`Deleted ${response.data.deletedCount} logs.`);
      setStartDate('');
      setEndDate('');
      fetchLogs(); // Refresh logs
    } catch (err) {
      setDeleteStatus(err.response?.data?.message || 'Failed to delete logs.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="card-title mb-0">Login Activity Report</h4>
            <button 
              className="btn btn-primary"
              onClick={handleDownload}
              disabled={logs.length === 0}
            >
              <FaDownload className="me-2" />
              Download Report
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {deleteStatus && (
            <div className="alert alert-info" role="alert">
              {deleteStatus}
            </div>
          )}

          <form className="d-flex align-items-center gap-2 mb-3" onSubmit={handleDeleteByRange}>
            <input
              type="date"
              className="form-control form-control-sm"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{ maxWidth: 150 }}
            />
            <input
              type="date"
              className="form-control form-control-sm"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={{ maxWidth: 150 }}
            />
            <button
              type="submit"
              className="btn btn-danger btn-sm"
              disabled={!startDate || !endDate}
            >
              <FaTrash className="me-1" />
              Delete by Range
            </button>
          </form>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">No login logs found</td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <tr key={index}>
                      <td>{new Date(log.timestamp).toLocaleDateString()}</td>
                      <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td>
                        <span className={`badge ${log.action === 'login' ? 'bg-success' : 'bg-danger'}`}>
                          {log.action}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginReport; 