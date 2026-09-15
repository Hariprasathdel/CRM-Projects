import React from 'react';
import { Card } from 'react-bootstrap';
import { FaUserTimes, FaClock } from 'react-icons/fa';
import './Dashboard.css';

const TodayAbsents = ({ count = 30, percentage = 30, total = 30 }) => {
  const absentEmployees = [
    { name: 'Mike Johnson', department: 'Electrical', reason: 'Sick' },
    { name: 'Sarah Williams', department: 'Production', reason: 'Personal' },
    { name: 'David Wilson', department: 'Finance', reason: 'Emergency' }
  ];

  return (
    <Card className="dashboard-card today-card absent-today-card">
      <Card.Header className="today-card-header">
        <div className="header-content">
          <div className="header-left">
            <FaUserTimes className="header-icon text-danger" />
            <div>
              <h5 className="card-title-sm">Today Absents</h5>
              <span className="card-subtitle-sm">{count} employees absent</span>
            </div>
          </div>
          <div className="header-right">
            <span className="today-percentage text-danger">{percentage}%</span>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="absent-list">
          {absentEmployees.map((employee, index) => (
            <div key={index} className="absent-item">
              <div className="absent-item-left">
                <div className="absent-avatar">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absent-details">
                  <div className="absent-name">{employee.name}</div>
                  <div className="absent-department">{employee.department}</div>
                </div>
              </div>
              <div className="absent-reason">
                <FaClock className="reason-icon" />
                {employee.reason}
              </div>
            </div>
          ))}
        </div>
        
        <div className="absent-summary">
          <div className="summary-message text-danger">
            {percentage}% of employees are absent, leaving {count} absent
          </div>
          <div className="summary-stats">
            <span className="stat-label">Absent Today</span>
            <span className="stat-value">{count}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TodayAbsents;