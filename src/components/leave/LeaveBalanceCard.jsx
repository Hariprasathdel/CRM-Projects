import React from 'react';
import { Card, ProgressBar, Badge, Button } from 'react-bootstrap';
import { FaEye, FaUserClock } from 'react-icons/fa';
import './LeaveBalanceCard.css';

const LeaveBalanceCard = ({ employee, leaveTypes, onViewHistory }) => {
  // Total used across all leave types
  const totalUsed = Object.values(employee.balances).reduce(
    (s, b) => s + b.used,
    0
  );
  const totalPending = Object.values(employee.balances).reduce(
    (s, b) => s + b.pending,
    0
  );

  return (
    <Card className="leave-balance-card">
      <Card.Body>
        {/* Employee Header */}
        <div className="balance-card-header">
          <div className="balance-card-avatar">{employee.avatar}</div>
          <div className="balance-card-info">
            <h6 className="balance-card-name">{employee.employeeName}</h6>
            <div className="balance-card-meta">
              <span>#{employee.employeeId}</span>
              <span className="meta-dot">•</span>
              <span>{employee.department}</span>
            </div>
            <div className="balance-card-position">{employee.position}</div>
          </div>
          <div className="balance-card-badge-wrapper">
            {totalPending > 0 && (
              <Badge bg="warning" pill className="balance-card-pending-badge">
                {totalPending} pending
              </Badge>
            )}
          </div>
        </div>

        {/* Balances */}
        <div className="balance-list">
          {leaveTypes.map((type) => {
            const bal = employee.balances[type.key];
            if (!bal || bal.total === 0) return null;

            const usedPct = bal.total > 0 ? (bal.used / bal.total) * 100 : 0;
            const pendingPct = bal.total > 0 ? (bal.pending / bal.total) * 100 : 0;
            const remainingPct = 100 - usedPct - pendingPct;

            return (
              <div className="balance-item" key={type.key}>
                <div className="balance-item-header">
                  <div className="balance-item-left">
                    <span className={`balance-item-icon icon-${type.bg}`}>
                      {type.icon}
                    </span>
                    <span className="balance-item-label">{type.label}</span>
                  </div>
                  <div className="balance-item-right">
                    <span className="balance-item-remaining">
                      <strong>{bal.remaining}</strong>
                      <small> / {bal.total}</small>
                    </span>
                  </div>
                </div>

                <ProgressBar className="balance-progress">
                  <ProgressBar
                    variant={type.color}
                    now={usedPct}
                    key="used"
                    label={usedPct > 15 ? `${bal.used}d` : ''}
                  />
                  <ProgressBar
                    variant="warning"
                    now={pendingPct}
                    key="pending"
                    label={pendingPct > 15 ? `${bal.pending}d` : ''}
                  />
                  <ProgressBar
                    variant="light"
                    now={remainingPct}
                    key="remaining"
                  />
                </ProgressBar>

                <div className="balance-item-detail">
                  <span className="detail-used">
                    Used: <strong>{bal.used}d</strong>
                  </span>
                  {bal.pending > 0 && (
                    <span className="detail-pending">
                      Pending: <strong>{bal.pending}d</strong>
                    </span>
                  )}
                  <span className="detail-left">
                    Left: <strong className="text-success">{bal.remaining}d</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Footer */}
        <div className="balance-card-footer">
          <div className="footer-stats">
            <div className="footer-stat">
              <small>Total Used</small>
              <strong className="text-danger">{totalUsed} days</strong>
            </div>
            <div className="footer-stat">
              <small>Pending</small>
              <strong className="text-warning">{totalPending} days</strong>
            </div>
          </div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={onViewHistory}
            className="view-history-btn"
          >
            <FaEye className="me-1" /> View History
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LeaveBalanceCard;