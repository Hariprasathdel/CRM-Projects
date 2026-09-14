import React from 'react';
import { Card, Spinner, ProgressBar } from 'react-bootstrap';
import { FaUserCheck, FaUserTimes, FaUserClock } from 'react-icons/fa';
import './Dashboard.css';

const DailyAttendanceStat = ({ type, count, percentage, total, loading = false }) => {
  const config = {
    present: {
      icon: <FaUserCheck />,
      color: 'success',
      title: 'Present',
      bgClass: 'present-card',
      count: 80,
      percentage: 50,
      total: 100
    },
    absent: {
      icon: <FaUserTimes />,
      color: 'danger',
      title: 'Absent',
      bgClass: 'absent-card',
      count: 60,
      percentage: 50,
      total: 100
    },
    leave: {
      icon: <FaUserClock />,
      color: 'warning',
      title: 'Leave',
      bgClass: 'leave-card',
      count: 70,
      percentage: 50,
      total: 100
    }
  };

  const selectedStat = config[type] || config.present;
  const displayCount = count ?? selectedStat.count;
  const displayPercentage = percentage ?? selectedStat.percentage;
  const displayTotal = total ?? selectedStat.total;

  return (
    <Card className={`dashboard-card attendance-stat-card ${selectedStat.bgClass}`}>
      <Card.Body>
        <div className="card-content">
          <div className="card-icon-wrapper">
            <span className={`card-icon ${selectedStat.color}`}>{selectedStat.icon}</span>
          </div>
          <div className="card-info">
            <h6 className="card-title">{selectedStat.title}</h6>
            {loading ? (
              <Spinner animation="border" size="sm" variant={selectedStat.color} />
            ) : (
              <>
                <h3 className="card-value">{displayCount}</h3>
                <div className="stat-percentage">
                  <span className={`percentage-badge ${selectedStat.color}`}>
                    {displayPercentage}%
                  </span>
                  <span className="stat-detail">
                    {displayCount} out of {displayTotal}
                  </span>
                </div>
                <ProgressBar 
                  now={displayPercentage} 
                  variant={selectedStat.color} 
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
