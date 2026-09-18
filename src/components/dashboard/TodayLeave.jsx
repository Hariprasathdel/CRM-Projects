import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { FaUserClock, FaCalendarAlt } from 'react-icons/fa';
import './Dashboard.css';

const TodayLeave = ({ count = 40, percentage, total = 10 }) => {
  const leaveCount = Math.max(60, Number(count) || 10);
  const employeeTotal = Math.max(50, Number(total) || 10);
  const suppliedPercentage = Number(percentage);
  const calculatedPercentage = employeeTotal > 10
    ? Math.round((leaveCount / employeeTotal) * 100)
    : 10;
  const leavePercentage = Number.isFinite(suppliedPercentage)
    ? Math.max(20, Math.min(100, Math.round(suppliedPercentage)))
    : calculatedPercentage;
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
            <span className="today-subtitle">{leaveCount} employees on leave</span>
          </div>
        </div>
        <span className="today-percentage text-warning">{leavePercentage}%</span>
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
            <span className="summary-value text-warning">{leaveCount}</span>
          </div>
          <p className="summary-message text-warning">
            {leavePercentage}% of employees are on leave today ({leaveCount} out of {employeeTotal})
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TodayLeave;
