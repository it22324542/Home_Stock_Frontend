import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaFilePdf, 
  FaSearch, 
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaClock,
  FaTable,
  FaChartBar
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/logs/login-activities', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        setActivities(response.data);
        setFilteredActivities(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    let result = activities;
    
    // Filter by date range
    if (dateRange.start || dateRange.end) {
      result = result.filter(activity => {
        const activityDate = new Date(activity.loginTime).toISOString().split('T')[0];
        return (
          (!dateRange.start || activityDate >= dateRange.start) &&
          (!dateRange.end || activityDate <= dateRange.end)
        );
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(activity => 
        activity.email.toLowerCase().includes(term) || 
        activity.username.toLowerCase().includes(term)
  )};
    
    setFilteredActivities(result);
  }, [dateRange, searchTerm, activities]);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('Login Activity Report', 14, 22);
    
    // Date range info if selected
    if (dateRange.start || dateRange.end) {
      doc.setFontSize(12);
      doc.text(
        `Date Range: ${dateRange.start || 'Start'} to ${dateRange.end || 'End'}`,
        14,
        32
      );
    }
    
    // Table data
    const tableData = filteredActivities.map(activity => [
      activity.username,
      activity.email,
      new Date(activity.loginTime).toLocaleString(),
      activity.ipAddress || 'N/A'
    ]);
    
    // Generate table
    doc.autoTable({
      head: [['Username', 'Email', 'Login Time', 'IP Address']],
      body: tableData,
      startY: dateRange.start || dateRange.end ? 40 : 30,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Add chart if there's data
    if (filteredActivities.length > 0) {
      const chartData = prepareChartData();
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Login Activity Overview', 14, 22);
      
      // Simple bar chart using lines (jsPDF doesn't have native chart support)
      const maxValue = Math.max(...chartData.map(item => item.logins));
      const chartHeight = 80;
      const chartWidth = 160;
      const startX = 20;
      const startY = 40;
      const barWidth = 15;
      const gap = 20;
      
      // X and Y axes
      doc.line(startX, startY, startX, startY + chartHeight);
      doc.line(startX, startY + chartHeight, startX + chartWidth, startY + chartHeight);
      
      // Bars and labels
      chartData.forEach((item, index) => {
        const x = startX + 10 + (index * (barWidth + gap));
        const barHeight = (item.logins / maxValue) * chartHeight;
        
        // Bar
        doc.setFillColor(41, 128, 185);
        doc.rect(x, startY + chartHeight - barHeight, barWidth, barHeight, 'F');
        
        // Date label
        doc.setFontSize(8);
        doc.text(item.date.substring(5), x, startY + chartHeight + 5, { align: 'center' });
        
        // Value label
        doc.text(item.logins.toString(), x + barWidth/2, startY + chartHeight - barHeight - 3, { align: 'center' });
      });
    }
    
    doc.save('login_activity_report.pdf');
  };

  const prepareChartData = () => {
    const dateCounts = {};
    
    filteredActivities.forEach(activity => {
      const date = new Date(activity.loginTime).toISOString().split('T')[0];
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });
    
    return Object.entries(dateCounts).map(([date, logins]) => ({
      date,
      logins
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">
              <FaTable className="me-2" />
              Login Activity Log
            </h3>
            <button 
              className="btn btn-light"
              onClick={generatePDF}
            >
              <FaFilePdf className="me-2" />
              Export PDF
            </button>
          </div>
        </div>
        
        <div className="card-body">
          {/* Filters */}
          <div className="row mb-4 g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FaCalendarAlt />
                </span>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Start Date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                />
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FaCalendarAlt />
                </span>
                <input
                  type="date"
                  className="form-control"
                  placeholder="End Date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                />
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by email or username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Chart */}
          <div className="mb-5" style={{ height: '300px' }}>
            <h5 className="mb-3">
              <FaChartBar className="me-2" />
              Login Activity Overview
            </h5>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="logins" fill="#2980b9" name="Logins" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Activity Table */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th><FaUser className="me-2" />Username</th>
                    <th><FaEnvelope className="me-2" />Email</th>
                    <th><FaClock className="me-2" />Login Time</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                      <tr key={activity._id}>
                        <td>{activity.username}</td>
                        <td>{activity.email}</td>
                        <td>{new Date(activity.loginTime).toLocaleString()}</td>
                        <td>{activity.ipAddress || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No login activities found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;