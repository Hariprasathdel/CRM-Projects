import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { FaUserClock, FaCalendarAlt } from 'react-icons/fa';
import './Dashboard.css';

const TodayLeave = ({ count = 9, percentage = 35, total = 26 }) => {
  const leaveEmployees = [
    {
      name: 'Sarah Williams',
      department: 'Production',
      reason: 'Personal Leave',
      type: 'Annual'
    },
    {
      name: 'Thomas Goodman',
      department: 'Software',
      reason: 'Family Emergency',
      type: 'Emergency'
    },
    {
      name: 'Linda Martinez',
      department: 'Marketing',
      reason: 'Medical Leave',
      type: 'Sick'
    }
  ];

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase();

  const getTypeVariant = (type) => {
    const map = {
      Annual: 'primary',
      Emergency: 'danger',
      Sick: 'warning',
      Personal: 'info'
    };
    return map[type] || 'secondary';
  };

  return (
    <Card className="dashboard-card today-card h-100">
      <Card.Header className="today-card-header">
        <div className="today-header-left">
          <div className="today-icon leave-icon">
            <FaUserClock />
          </div>
          <div>
            <h5 className="today-title">Today Leave</h5>
            <span className="today-subtitle">{count} employees on leave</span>
          </div>
        </div>
        <span className="today-percentage text-warning">{percentage}%</span>
      </Card.Header>

      <Card.Body className="today-card-body">
        <div className="today-list">
          {leaveEmployees.map((emp, index) => (
            <div key={index} className="today-item">
              <div className="today-item-left">
                <div className="today-avatar leave-avatar">
                  {getInitials(emp.name)}
                </div>
                <div className="today-details">
                  <div className="today-name">{emp.name}</div>
                  <div className="today-department">{emp.department}</div>
                </div>
              </div>
              <div className="today-reason">
                <Badge bg={getTypeVariant(emp.type)} className="leave-type-badge">
                  {emp.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="today-summary">
          <div className="summary-row">
            <span className="summary-label">
              <FaCalendarAlt className="me-1" />
              On Leave Today
            </span>
            <span className="summary-value text-warning">{count}</span>
          </div>
          <p className="summary-message text-warning">
            {percentage}% of employees are on leave today ({count} out of {total})
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TodayLeave;