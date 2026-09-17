import React from 'react';
import { Card } from 'react-bootstrap';
import { FaUserTimes, FaClock } from 'react-icons/fa';
import './Dashboard.css';

const TodayAbsents = ({ count = 13, percentage = 50, total = 26 }) => {
  const absentEmployees = [
    { name: 'Mike Johnson', department: 'Electrical', reason: 'Sick' },
    { name: 'Sarah Williams', department: 'Production', reason: 'Personal' },
    { name: 'David Wilson', department: 'Finance', reason: 'Emergency' }
  ];

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase();

  return (
    <Card className="dashboard-card today-card h-100">
      <Card.Header className="today-card-header">
        <div className="today-header-left">
          <div className="today-icon absent-icon">
            <FaUserTimes />
          </div>
          <div>
            <h5 className="today-title">Today Absents</h5>
            <span className="today-subtitle">{count} employees absent</span>
          </div>
        </div>
        <span className="today-percentage text-danger">{percentage}%</span>
      </Card.Header>

      <Card.Body className="today-card-body">
        <div className="today-list">
          {absentEmployees.map((emp, index) => (
            <div key={index} className="today-item">
              <div className="today-item-left">
                <div className="today-avatar absent-avatar">
                  {getInitials(emp.name)}
                </div>
                <div className="today-details">
                  <div className="today-name">{emp.name}</div>
                  <div className="today-department">{emp.department}</div>
                </div>
              </div>
              <div className="today-reason">
                <FaClock className="me-1" />
                {emp.reason}
              </div>
            </div>
          ))}
        </div>

        <div className="today-summary">
          <div className="summary-row">
            <span className="summary-label">Absent Today</span>
            <span className="summary-value text-danger">{count}</span>
          </div>
          <p className="summary-message text-danger">
            {percentage}% of employees are absent, leaving {count} absent
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TodayAbsents;