import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { FaUserClock, FaCalendarAlt } from 'react-icons/fa';
import './Dashboard.css';

const TodayLeave = ({ count = 20, percentage = 20, total = 60 }) => {
  const leaveEmployees = [
    { name: 'Sarah Williams', department: 'Production', reason: 'Personal Leave', type: 'Annual' },
    { name: 'Thomas Goodman', department: 'Software', reason: 'Family Emergency', type: 'Emergency' },
    { name: 'Linda Martinez', department: 'Marketing', reason: 'Medical Leave', type: 'Sick' }
  ];

  return (
    <Card className="dashboard-card today-card leave-today-card">
      <Card.Header className="today-card-header">
        <div className="header-content">
          <div className="header-left">
            <FaUserClock className="header-icon text-warning" />
            <div>
              <h5 className="card-title-sm">Today Leave</h5>
              <span className="card-subtitle-sm">{count} employees on leave</span>
            </div>
          </div>
          <div className="header-right">
            <span className="today-percentage text-warning">{percentage}%</span>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="leave-list">
          {leaveEmployees.map((employee, index) => (
            <div key={index} className="leave-item">
              <div className="leave-item-left">
                <div className="leave-avatar">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="leave-details">
                  <div className="leave-name">{employee.name}</div>
                  <div className="leave-department">{employee.department}</div>
                </div>
              </div>
              <div className="leave-reason">
                <Badge bg="warning" text="dark" className="leave-type">
                  {employee.type}
                </Badge>
                <div className="leave-reason-text">{employee.reason}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="leave-summary">
          <div className="summary-stats">
            <FaCalendarAlt className="summary-icon" />
            <span className="summary-message">
              {percentage}% of employees are on leave today ({count} out of {total})
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TodayLeave;