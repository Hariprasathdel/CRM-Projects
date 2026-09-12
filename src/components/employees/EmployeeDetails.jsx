import React from 'react';
import {
  Row,
  Col,
  Card,
  Badge,
  Button,
  ListGroup,
  Table
} from 'react-bootstrap';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaCalendar,
  FaDollarSign,
  FaMapMarker,
  FaExclamationCircle,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaUserTimes
} from 'react-icons/fa';
import './EmployeeDetails.css';

const EmployeeDetails = ({ employee, onEdit, onDelete, onClose }) => {
  if (!employee) return null;

  const getStatusBadge = (status) => {
    const config = {
      Active: { variant: 'success', icon: <FaCheckCircle />, text: 'Active' },
      Leave: { variant: 'warning', icon: <FaClock />, text: 'On Leave' },
      Inactive: { variant: 'danger', icon: <FaUserTimes />, text: 'Inactive' }
    };
    const { variant, icon, text } = config[status] || config.Active;
    return (
      <Badge bg={variant} className="status-badge-large">
        {icon} {text}
      </Badge>
    );
  };

  const getPerformanceBadge = (performance) => {
    const config = {
      Excellent: 'success',
      Good: 'info',
      Average: 'warning',
      Poor: 'danger'
    };
    return (
      <Badge bg={config[performance] || 'secondary'} className="performance-badge-large">
        {performance}
      </Badge>
    );
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="employee-details-wrapper">
      {/* Header */}
      <div className="details-header">
        <div className="details-avatar-large">
          {employee.avatar || employee.firstName.charAt(0) + employee.lastName.charAt(0)}
        </div>
        <div className="details-title">
          <h3 className="employee-name-large">
            {employee.firstName} {employee.lastName}
          </h3>
          <div className="employee-meta">
            <span className="meta-item">
              <FaBriefcase className="me-1" /> {employee.position}
            </span>
            <span className="meta-divider">|</span>
            <span className="meta-item">{employee.department}</span>
            <span className="meta-divider">|</span>
            {getStatusBadge(employee.status)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="details-actions">
        <Button variant="outline-primary" size="sm" onClick={() => onEdit(employee)}>
          <FaEdit className="me-1" /> Edit
        </Button>
        <Button variant="outline-danger" size="sm" onClick={() => onDelete(employee.id)}>
          <FaTrash className="me-1" /> Delete
        </Button>
        <Button variant="outline-secondary" size="sm" onClick={onClose}>
          <FaTimes className="me-1" /> Close
        </Button>
      </div>

      {/* Main Content */}
      <Row className="details-content">
        <Col lg={7} md={12}>
          <Card className="details-card">
            <Card.Header className="details-card-header">
              <h6 className="mb-0">
                <FaUser className="me-2" /> Personal Information
              </h6>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">
                    <FaEnvelope className="label-icon" /> Email
                  </div>
                  <div className="list-item-value">{employee.email}</div>
                </ListGroup.Item>
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">
                    <FaPhone className="label-icon" /> Phone
                  </div>
                  <div className="list-item-value">{employee.phone}</div>
                </ListGroup.Item>
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">
                    <FaMapMarker className="label-icon" /> Address
                  </div>
                  <div className="list-item-value">{employee.address || 'Not provided'}</div>
                </ListGroup.Item>
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">
                    <FaCalendar className="label-icon" /> Join Date
                  </div>
                  <div className="list-item-value">{formatDate(employee.joinDate)}</div>
                </ListGroup.Item>
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">
                    <FaDollarSign className="label-icon" /> Salary
                  </div>
                  <div className="list-item-value">${employee.salary?.toLocaleString() || 'N/A'}</div>
                </ListGroup.Item>
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">
                    <FaExclamationCircle className="label-icon" /> Emergency Contact
                  </div>
                  <div className="list-item-value">{employee.emergencyContact || 'Not provided'}</div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5} md={12}>
          <Card className="details-card">
            <Card.Header className="details-card-header">
              <h6 className="mb-0">
                <FaBriefcase className="me-2" /> Work Information
              </h6>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">Performance</div>
                  <div className="list-item-value">
                    {getPerformanceBadge(employee.performance)}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">Skills</div>
                  <div className="list-item-value">
                    {employee.skills && employee.skills.length > 0 ? (
                      <div className="skills-container">
                        {employee.skills.map((skill, index) => (
                          <Badge key={index} bg="info" className="skill-badge">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      'No skills listed'
                    )}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">Projects</div>
                  <div className="list-item-value">
                    {employee.projects && employee.projects.length > 0 ? (
                      <div className="projects-container">
                        {employee.projects.map((project, index) => (
                          <div key={index} className="project-item">
                            • {project}
                          </div>
                        ))}
                      </div>
                    ) : (
                      'No projects assigned'
                    )}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="details-list-item">
                  <div className="list-item-label">Department</div>
                  <div className="list-item-value">
                    <Badge bg="secondary" className="department-badge-large">
                      {employee.department}
                    </Badge>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeDetails;