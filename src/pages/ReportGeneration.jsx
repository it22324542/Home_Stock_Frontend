import React, { useState } from 'react';
import { FaFilePdf, FaFileCsv, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportGeneration = ({ activities = [] }) => {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [activityType, setActivityType] = useState('all');
  
  // Filter activities based on selections
  const filteredActivities = activities.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    
    const matchesDate = (!startDate || activityDate >= startDate) && 
                       (!endDate || activityDate <= new Date(endDate.setHours(23, 59, 59)));
    const matchesType = activityType === 'all' || activity.type === activityType;
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
        activity.type,
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

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-white">
        <h4 className="mb-0">
          <i className="fas fa-chart-line me-2"></i>
          User Activity Report
        </h4>
      </div>
      <div className="card-body">
        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-4">
            <label className="form-label">
              <FaCalendarAlt className="me-2" />
              Start Date
            </label>
            <input
              type="date"
              className="form-control"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">
              <FaCalendarAlt className="me-2" />
              End Date
            </label>
            <input
              type="date"
              className="form-control"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">
              <FaFilter className="me-2" />
              Activity Type
            </label>
            <select
              className="form-select"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
            >
              <option value="all">All Activities</option>
              <option value="login">Logins</option>
              <option value="profile_update">Profile Updates</option>
              <option value="settings_change">Settings Changes</option>
            </select>
          </div>
        </div>

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
        <div className="table-responsive">
          <table className="table table-striped">
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
          </table>
        </div>

        {/* Export Buttons */}
        <div className="d-flex justify-content-end mt-3 gap-2">
          <button className="btn btn-danger" onClick={handleExportPDF}>
            <FaFilePdf className="me-2" />
            Export PDF
          </button>
          <button className="btn btn-success" onClick={handleExportCSV}>
            <FaFileCsv className="me-2" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGeneration;