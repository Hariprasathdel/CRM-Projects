import React from 'react';
import { Card, Spinner, ProgressBar } from 'react-bootstrap';
import { FaUserCheck, FaUserTimes, FaUserClock } from 'react-icons/fa';
import './Dashboard.css';

const DailyAttendanceStat = ({ type, count = 80, percentage = 50, total = 100, loading = false }) => {
  const config = {
    present: {
      icon: <FaUserCheck />,
      color: 'success',
      title: 'Present',
      bgClass: 'present-card'
    },
    absent: {
      icon: <FaUserTimes />,
      color: 'danger',
      title: 'Absent',
      bgClass: 'absent-card'
    },
    leave: {
      icon: <FaUserClock />,
      color: 'warning',
      title: 'Leave',
      bgClass: 'leave-card'
    }
  };

  const { icon, color, title, bgClass } = config[type] || config.present;

  return (
    <Card className={`dashboard-card attendance-stat-card ${bgClass}`}>
      <Card.Body>
        <div className="card-content">
          <div className="card-icon-wrapper">
            <span className={`card-icon ${color}`}>{icon}</span>
          </div>
          <div className="card-info">
            <h6 className="card-title">{title}</h6>
            {loading ? (
              <Spinner animation="border" size="sm" variant={color} />
            ) : (
              <>
                <h3 className="card-value">{count}</h3>
                <div className="stat-percentage">
                  <span className={`percentage-badge ${color}`}>
                    {percentage}%
                  </span>
                  <span className="stat-detail">
                    {count} out of {total}
                  </span>
                </div>
                <ProgressBar 
                  now={percentage} 
                  variant={color} 
                  className="stat-progress"
                  style={{ height: '4px' }}
                />
              </>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DailyAttendanceStat;