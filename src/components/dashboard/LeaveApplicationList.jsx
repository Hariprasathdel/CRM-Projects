import React, { useState } from 'react';
import { Card, Badge, Form } from 'react-bootstrap';
import { FaCheck, FaTimes, FaClock, FaCalendarAlt } from 'react-icons/fa';
import './Dashboard.css';

const LeaveApplicationList = () => {
  const [filter, setFilter] = useState('all');

  const applications = [
    {
      id: 1,
      name: 'Maisha Lucy Zamora Fonzales',
      reason: 'Dental surgery',
      status: 'Approved',
      type: 'Medical',
      date: '2026-01-15'
    },
    {
      id: 2,
      name: 'Jonathan Ibrahim Sheakh',
      reason: 'Personal Leave',
      status: 'Pending',
      type: 'Personal',
      date: '2026-01-15'
    },
    {
      id: 3,
      name: 'Thomas Goodman',
      reason: 'Family Emergency',
      status: 'Approved',
      type: 'Emergency',
      date: '2026-01-14'
    },
    {
      id: 4,
      name: 'Maisha Lucy Zamora Fonzales',
      reason: 'Dental surgery',
      status: 'Approved',
      type: 'Medical',
      date: '2026-01-14'
    },
    {
      id: 5,
      name: 'Sarah Williams',
      reason: 'Annual Leave',
      status: 'Pending',
      type: 'Annual',
      date: '2026-01-13'
    }
  ];

  const filteredData = applications.filter((app) =>
    filter === 'all' ? true : app.status.toLowerCase() === filter
  );

  const getStatusBadge = (status) => {
    const config = {
      Approved: { bg: 'success', icon: <FaCheck /> },
      Pending: { bg: 'warning', icon: <FaClock /> },
      Rejected: { bg: 'danger', icon: <FaTimes /> }
    };
    const { bg, icon } = config[status] || config.Pending;
    return (
      <Badge bg={bg} className="leave-status-badge">
        {icon} {status}
      </Badge>
    );
  };

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Card className="dashboard-card leave-app-card h-100">
      <Card.Header className="card-header-custom">
        <div>
          <h5 className="card-title">Leave Applications</h5>
          <span className="card-badge">{applications.length} applications</span>
        </div>
        <Form.Select
          size="sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="card-filter-select"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Form.Select>
      </Card.Header>

      <Card.Body className="p-0">
        <div className="leave-app-list">
          {filteredData.map((app) => (
            <div key={app.id} className="leave-app-item">
              <div className="leave-app-avatar">{getInitials(app.name)}</div>
              <div className="leave-app-info">
                <div className="leave-app-name">{app.name}</div>
                <div className="leave-app-meta">
                  <span>{app.reason}</span>
                  <span className="meta-dot">•</span>
                  <span>{app.type}</span>
                  <span className="meta-dot">•</span>
                  <span>
                    <FaCalendarAlt className="me-1" />
                    {app.date}
                  </span>
                </div>
              </div>
              <div className="leave-app-status">{getStatusBadge(app.status)}</div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="empty-list">
              <p className="text-muted text-center py-4 mb-0">
                No applications found
              </p>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default LeaveApplicationList;