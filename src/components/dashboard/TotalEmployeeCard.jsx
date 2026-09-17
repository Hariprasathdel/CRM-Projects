import React from 'react';
import { Card } from 'react-bootstrap';
import { FaUsers, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './Dashboard.css';

const TotalEmployeeCard = ({ total = 120, growth = 0, percentage = 100 }) => {
  const isPositive = growth >= 0;

  return (
    <Card className="stat-card total-employee-card">
      <Card.Body>
        <div className="stat-card-inner">
          <div className="stat-icon-wrapper icon-primary">
            <FaUsers className="stat-icon" />
          </div>
          <div className="stat-info">
            <h6 className="stat-title">Total Employee</h6>
            <h3 className="stat-value">
              {total}
              <span className="stat-percent-badge">({percentage}%)</span>
            </h3>
            <div className={`stat-growth ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <FaArrowUp /> : <FaArrowDown />}
              <span>
                Employee count grew the last 7 days, from {total - growth} to {total}
              </span>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TotalEmployeeCard;