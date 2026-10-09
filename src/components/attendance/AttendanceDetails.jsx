import React from 'react';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import {
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaComment, FaUser,
  FaBriefcase, FaEdit, FaTrash, FaTimes, FaCheckCircle,
  FaUserTimes, FaUserClock
} from 'react-icons/fa';
import './AttendanceDetails.css';

const statusConfig = {
  present: { label: 'Present', variant: 'success', icon: <FaCheckCircle /> },
  absent: { label: 'Absent', variant: 'danger', icon: <FaUserTimes /> },
  leave: { label: 'On Leave', variant: 'warning', icon: <FaUserClock /> },
  late: { label: 'Late', variant: 'info', icon: <FaClock /> }
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

const AttendanceDetails = ({ record, onEdit, onDelete, onClose }) => {
  if (!record) return null;
  const status = statusConfig[String(record.status || 'present').toLowerCase()] || statusConfig.present;
  const initials = (record.employeeName || 'Employee').split(' ').filter(Boolean)
    .map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  const infoRow = (Icon, label, value) => (
    <div className="attendance-detail-row" key={label}>
      <div className="attendance-detail-label"><Icon className="attendance-detail-icon" />{label}</div>
      <div className="attendance-detail-value">{value || '—'}</div>
    </div>
  );

  return (
    <div className="attendance-details-wrapper">
      <div className="attendance-details-header">
        <div className="attendance-details-avatar">{record.avatar || initials}</div>
        <div className="attendance-details-title">
          <h3>{record.employeeName || 'Employee'}</h3>
          <div className="attendance-details-meta">
            <span><FaBriefcase /> {record.employeeId || 'No employee ID'}</span>
            <span className="attendance-meta-divider">|</span>
            <span>{record.department || 'No department'}</span>
            <span className="attendance-meta-divider">|</span>
            <Badge bg={status.variant}>{status.icon}<span className="ms-1">{status.label}</span></Badge>
          </div>
        </div>
      </div>

      <div className="attendance-details-actions">
        <Button variant="outline-primary" onClick={onEdit}><FaEdit className="me-2" />Edit</Button>
        <Button variant="outline-danger" onClick={onDelete}><FaTrash className="me-2" />Delete</Button>
        <Button variant="outline-secondary" onClick={onClose}><FaTimes className="me-2" />Close</Button>
      </div>

      <Row className="attendance-details-content">
        <Col lg={7}>
          <Card className="attendance-details-card">
            <Card.Header><FaUser className="me-2" />Employee Information</Card.Header>
            <Card.Body>
              {infoRow(FaUser, 'Employee Name', record.employeeName)}
              {infoRow(FaBriefcase, 'Employee ID', record.employeeId)}
              {infoRow(FaBriefcase, 'Department', record.department)}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          <Card className="attendance-details-card">
            <Card.Header><FaCalendarAlt className="me-2" />Attendance Information</Card.Header>
            <Card.Body>
              {infoRow(FaCalendarAlt, 'Date', formatDate(record.date))}
              {infoRow(FaClock, 'Check In', record.checkIn === '--' ? '—' : record.checkIn)}
              {infoRow(FaClock, 'Check Out', record.checkOut === '--' ? '—' : record.checkOut)}
              {infoRow(FaClock, 'Working Hours', record.workingHours)}
              {infoRow(FaClock, 'Overtime', record.overtime)}
              {infoRow(FaMapMarkerAlt, 'Location', record.location)}
              {infoRow(FaComment, 'Remarks', record.remarks)}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AttendanceDetails;
