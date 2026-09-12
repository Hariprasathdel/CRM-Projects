import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import { FaUserCheck, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './Dashboard.css';

const TodayPresents = ({ count = 5, percentage = 20, total = 40 }) => {
  const presentEmployees = [
    { name: 'John Doe', department: 'Software', time: '09:00 AM' },
    { name: 'Jane Smith', department: 'Marketing', time: '09:30 AM' },
    { name: 'Robert Brown', department: 'Software', time: '08:45 AM' },
    { name: 'Emily Davis', department: 'HR', time: '09:15 AM' }
  ];

  return (
    <Card className="dashboard-card today-card present-today-card">
      <Card.Header className="today-card-header">
        <div className="header-content">
          <div className="header-left">
            <FaUserCheck className="header-icon text-success" />
            <div>
              <h5 className="card-title-sm">Today Presents</h5>
              <span className="card-subtitle-sm">{count} employees present</span>
            </div>
          </div>
          <div className="header-right">
            <span className="today-percentage">{percentage}%</span>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="present-list">
          {presentEmployees.map((employee, index) => (
            <div key={index} className="present-item">
              <div className="present-item-left">
                <div className="present-avatar">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="present-details">
                  <div className="present-name">{employee.name}</div>
                  <div className="present-department">{employee.department}</div>
                </div>
              </div>
              <div className="present-time">{employee.time}</div>
            </div>
          ))}
        </div>
        
        <div className="present-summary">
          <div className="summary-stats">
            <span className="stat-label">Today's Attendance</span>
            <span className="stat-value">{count}/{total}</span>
          </div>
          <ProgressBar 
            now={percentage} 
            variant="success" 
            className="summary-progress"
            style={{ height: '6px' }}
          />
          <div className="summary-message">
            {percentage}% of employees are present today ({count} out of {total})
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TodayPresents;