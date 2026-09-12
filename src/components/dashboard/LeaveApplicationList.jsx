import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form } from 'react-bootstrap';
import { FaCheck, FaTimes, FaClock, FaFilter } from 'react-icons/fa';
import './Dashboard.css';

const LeaveApplicationList = () => {
  const [filter, setFilter] = useState('all');
  
  const leaveApplications = [
    { 
      id: 1, 
      name: 'Maisha Lucy zamora Fonzales', 
      reason: 'Dental surgery', 
      status: 'Approved',
      date: '2026-01-15',
      department: 'Software',
      type: 'Medical'
    },
   
    { 
      id: 3, 
      name: 'Thomas Goodman', 
      reason: 'Family Emergency', 
      status: 'Approved',
      date: '2026-01-14',
      department: 'Marketing',
      type: 'Emergency'
    },
    { 
      id: 4, 
      name: 'Maisha Lucy zamora Fonzales', 
      reason: 'Dental surgery', 
      status: 'Approved',
      date: '2026-01-14',
      department: 'Software',
      type: 'Medical'
    },
    { 
      id: 5, 
      name: 'Sarah Williams', 
      reason: 'Annual Leave', 
      status: 'Pending',
      date: '2026-01-15',
      department: 'HR',
      type: 'Annual'
    }
  ];

  const getStatusBadge = (status) => {
    const config = {
      Approved: { variant: 'success', icon: <FaCheck /> },
      Pending: { variant: 'warning', icon: <FaClock /> },
      Rejected: { variant: 'danger', icon: <FaTimes /> }
    };
    const { variant, icon } = config[status] || config.Pending;
    return (
      <Badge bg={variant} className="status-badge">
        {icon} {status}
      </Badge>
    );
  };

  const filteredData = leaveApplications.filter(item => 
    filter === 'all' ? true : item.status.toLowerCase() === filter
  );

  return (
    <Card className="dashboard-card leave-application-card">
      <Card.Header className="card-header-with-actions">
        <div className="header-content">
          <h5 className="card-title">Leave Application</h5>
          <span className="card-badge">{leaveApplications.length} applications</span>
        </div>
        <div className="header-actions">
          <Form.Select 
            size="sm" 
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Form.Select>
          <Button variant="outline-primary" size="sm">
            <FaFilter /> Filter
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="leave-list-wrapper">
          {filteredData.map((leave) => (
            <div key={leave.id} className="leave-item-row">
              <div className="leave-item-content">
                <div className="leave-avatar-wrapper">
                  <div className="leave-avatar">
                    {leave.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                </div>
                <div className="leave-info">
                  <div className="leave-name">{leave.name}</div>
                  <div className="leave-meta">
                    <span className="leave-reason">{leave.reason}</span>
                    <span className="leave-dot">•</span>
                    <span className="leave-department">{leave.department}</span>
                    <span className="leave-dot">•</span>
                    <span className="leave-date">{leave.date}</span>
                  </div>
                </div>
                <div className="leave-actions">
                  {getStatusBadge(leave.status)}
                  {leave.status === 'Pending' && (
                    <div className="action-buttons">
                      <Button variant="success" size="sm" className="action-btn">
                        <FaCheck />
                      </Button>
                      <Button variant="danger" size="sm" className="action-btn">
                        <FaTimes />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default LeaveApplicationList;