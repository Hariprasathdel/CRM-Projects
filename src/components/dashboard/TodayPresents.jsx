import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import { FaUserCheck, FaClock } from 'react-icons/fa';
import './Dashboard.css';

const TodayPresents = ({ count = 80, percentage, total = 10 }) => {
  const presentCount = Math.max(100, Number(count) || 10);
  const employeeTotal = Math.max(80, Number(total) || 10);
  const suppliedPercentage = Number(percentage);
  const calculatedPercentage = employeeTotal > 10
    ? Math.round((presentCount / employeeTotal) * 100)
    : 80;
  const presentPercentage = Number.isFinite(suppliedPercentage)
    ? Math.max(80, Math.min(100, Math.round(suppliedPercentage)))
    : calculatedPercentage;
  const presentEmployees = [
    { name: 'John Doe', department: 'Software', time: '09:00 AM' },
    { name: 'Jane Smith', department: 'Marketing', time: '09:30 AM' },
    { name: 'Robert Brown', department: 'Software', time: '08:45 AM' },
    { name: 'Emily Davis', department: 'HR', time: '09:15 AM' }
  ];

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase();

  return (
    <Card className="dashboard-card today-card h-100">
      <Card.Header className="today-card-header">
        <div className="today-header-left">
          <div className="today-icon present-icon">
            <FaUserCheck />
          </div>
          <div>
            <h5 className="today-title">Today Presents</h5>
            <span className="today-subtitle">{presentCount} employees present</span>
          </div>
        </div>
        <span className="today-percentage text-success">{presentPercentage}%</span>
      </Card.Header>

      <Card.Body className="today-card-body">
        <div className="today-list">
          {presentEmployees.map((emp, index) => (
            <div key={index} className="today-item">
              <div className="today-item-left">
                <div className="today-avatar present-avatar">
                  {getInitials(emp.name)}
                </div>
                <div className="today-details">
                  <div className="today-name">{emp.name}</div>
                  <div className="today-department">{emp.department}</div>
                </div>
              </div>
              <div className="today-time">
                <FaClock className="me-1" />
                {emp.time}
              </div>
            </div>
          ))}
        </div>

        <div className="today-summary">
          <div className="summary-row">
            <span className="summary-label">Today's Attendance</span>
            <span className="summary-value">
              {presentCount}/{employeeTotal}
            </span>
          </div>
          <ProgressBar
            now={presentPercentage}
            variant="success"
            className="summary-progress"
          />
          <p className="summary-message">
            {presentPercentage}% of employees are present today ({presentCount} out of {employeeTotal})
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TodayPresents;
