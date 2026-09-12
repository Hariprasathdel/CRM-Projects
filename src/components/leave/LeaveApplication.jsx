import React from 'react';
import {
  Row,
  Col,
  Card,
  Badge,
  Button,
  ListGroup
} from 'react-bootstrap';
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaComment,
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
  FaUserCheck,
  FaBuilding,
  FaFileAlt
} from 'react-icons/fa';
import './LeaveApplication.css';

const LeaveApplication = ({ leave, onApprove, onReject, onEdit, onDelete, onClose }) => {
  if (!leave) return null;

  const getStatusBadge = (status) => {
    const config = {
      Approved: { variant: 'success', icon: <FaCheck />, text: 'Approved' },
      Pending: { variant: 'warning', icon: <FaClock />, text: 'Pending' },
      Rejected: { variant: 'danger', icon: <FaTimes />, text: 'Rejected' }
    };
    const { variant, icon, text } = config[status] || config.Pending;
    return (
      <Badge bg={variant} className="status-badge-large">
        {icon} {text}
      </Badge>
    );
  };

  const getLeaveTypeBadge = (type) => {
    const config = {
      Annual: 'primary',
      Sick: 'info',
      Emergency: 'danger',
      Personal: 'secondary',
      Maternity: 'warning',
      Paternity: 'warning'
    };
    return (
      <Badge bg={config[type] || 'secondary'} className="type-badge-large">
        {type}
      </Badge>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="leave-application-wrapper">
      {/* Header */}
      <div className="application-header">
        <div className="application-avatar">
          {leave.avatar || leave.employeeName.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="application-title">
          <h4 className="employee-name-large">
            {leave.employeeName}
          </h4>
          <div className="employee-meta">
            <span className="meta-item">
              <FaUser className="me-1" /> {leave.employeeId}
            </span>
            <span className="meta-divider">|</span>
            <span className="meta-item">
              <FaBuilding className="me-1" /> {leave.department}
            </span>
          </div>
          <div className="application-status">
            {getStatusBadge(leave.status)}
            {getLeaveTypeBadge(leave.type)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="application-actions">
        {leave.status === 'Pending' && (
          <>
            <Button variant="success" size="sm" onClick={() => onApprove(leave.id)}>
              <FaCheck className="me-1" /> Approve
            </Button>
            <Button variant="danger" size="sm" onClick={() => onReject(leave.id)}>
              <FaTimes className="me-1" /> Reject
            </Button>
          </>
        )}
        <Button variant="outline-primary" size="sm" onClick={() => onEdit(leave)}>
          <FaEdit className="me-1" /> Edit
        </Button>
        <Button variant="outline-danger" size="sm" onClick={() => onDelete(leave.id)}>
          <FaTrash className="me-1" /> Delete
        </Button>
        <Button variant="outline-secondary" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Main Content */}
      <Row className="application-content">
        <Col lg={8} md={12}>
          <Card className="details-card">
            <Card.Header className="details-card-header">
              <h6 className="mb-0">
                <FaFileAlt className="me-2" /> Leave Details
              </h6>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">
                    <FaCalendarAlt className="label-icon" /> Start Date
                  </div>
                  <div className="list-item-value">{formatDate(leave.startDate)}</div>
                </ListGroup.Item>
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">
                    <FaCalendarAlt className="label-icon" /> End Date
                  </div>
                  <div className="list-item-value">{formatDate(leave.endDate)}</div>
                </ListGroup.Item>
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">
                    <FaClock className="label-icon" /> Total Days
                  </div>
                  <div className="list-item-value">{leave.totalDays} days</div>
                </ListGroup.Item>
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">
                    <FaComment className="label-icon" /> Reason
                  </div>
                  <div className="list-item-value">{leave.reason}</div>
                </ListGroup.Item>
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">
                    <FaClock className="label-icon" /> Applied On
                  </div>
                  <div className="list-item-value">{formatDateTime(leave.appliedDate)}</div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={12}>
          <Card className="details-card">
            <Card.Header className="details-card-header">
              <h6 className="mb-0">
                <FaUserCheck className="me-2" /> Approval Details
              </h6>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">Status</div>
                  <div className="list-item-value">
                    {getStatusBadge(leave.status)}
                  </div>
                </ListGroup.Item>
                
                {leave.approvedBy && (
                  <ListGroup.Item className="details-list-item">
                    <div className="list-item-label">Approved By</div>
                    <div className="list-item-value">{leave.approvedBy}</div>
                  </ListGroup.Item>
                )}
                
                {leave.approvedDate && (
                  <ListGroup.Item className="details-list-item">
                    <div className="list-item-label">Approved Date</div>
                    <div className="list-item-value">{formatDateTime(leave.approvedDate)}</div>
                  </ListGroup.Item>
                )}
                
                {leave.remarks && (
                  <ListGroup.Item className="details-list-item">
                    <div className="list-item-label">Remarks</div>
                    <div className="list-item-value">{leave.remarks}</div>
                  </ListGroup.Item>
                )}
                
                {!leave.approvedBy && leave.status === 'Pending' && (
                  <ListGroup.Item className="details-list-item">
                    <div className="list-item-label">Action Required</div>
                    <div className="list-item-value text-warning">
                      <FaClock className="me-1" /> Awaiting approval
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LeaveApplication;