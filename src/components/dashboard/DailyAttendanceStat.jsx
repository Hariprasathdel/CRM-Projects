import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import { FaUserCheck, FaUserTimes, FaUserClock } from 'react-icons/fa';
import './Dashboard.css';

const DailyAttendanceStat = ({ type, count = 120, percentage = 50, total = 0 }) => {
  const config = {
    present: {
      icon: <FaUserCheck />,
      title: 'Present',
      colorClass: 'present',
      variant: 'success'
    },
    absent: {
      icon: <FaUserTimes />,
      title: 'Absent',
      colorClass: 'absent',
      variant: 'danger'
    },
    leave: {
      icon: <FaUserClock />,
      title: 'Leave',
      colorClass: 'leave',
      variant: 'warning'
    }
  };

  const { icon, title, colorClass, variant } = config[type] || config.present;

  return (
    <Card className={`stat-card attendance-stat-card ${colorClass}`}>
      <Card.Body>
        <div className="stat-card-inner">
          <div className={`stat-icon-wrapper icon-${colorClass}`}>
            {icon}
          </div>
          <div className="stat-info">
            <h6 className="stat-title">{title}</h6>
            <h3 className="stat-value">
              {String(count).padStart(2, '0')}
              <span className="stat-percent-badge">({percentage}%)</span>
            </h3>
            <ProgressBar 
              now={percentage} 
              variant={variant} 
              className="stat-progress"
            />
            <div className="stat-detail">
              {count} out of {total} employees
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DailyAttendanceStat;