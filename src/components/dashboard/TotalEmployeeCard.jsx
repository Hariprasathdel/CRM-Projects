import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { FaUsers, FaArrowUp } from 'react-icons/fa';
import './Dashboard.css';

const TotalEmployeeCard = ({ total = 120, growth = 100, loading = false }) => {
  return (
    <Card className="dashboard-card total-employee-card">
      <Card.Body>
        <div className="card-content">
          <div className="card-icon-wrapper primary">
            <FaUsers className="card-icon" />
          </div>
          <div className="card-info">
            <h6 className="card-title">Total Employee</h6>
            {loading ? (
              <Spinner animation="border" size="sm" variant="primary" />
            ) : (
              <>
                <h3 className="card-value">{total}</h3>
                <div className="card-growth">
                  <span className="growth-badge positive">
                    <FaArrowUp className="growth-icon" />
                    {growth}%
                  </span>
                  {/* <span className="growth-text">Employee count grew the last 7 days</span> */}
                </div>
              </>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TotalEmployeeCard;