import React, { useState } from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner
} from 'react-bootstrap';
import { FaSave, FaTimes, FaUser, FaClock, FaCalendarDay } from 'react-icons/fa';
import './Attendance.css';

const AttendanceForm = ({ onSubmit, onCancel, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    employeeName: initialData?.employeeName || '',
    employeeId: initialData?.employeeId || '',
    department: initialData?.department || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    checkIn: initialData?.checkIn || '',
    checkOut: initialData?.checkOut || '',
    status: initialData?.status || 'present',
    remarks: initialData?.remarks || '',
    leaveReason: initialData?.leaveReason || '',
  });

  const departments = ['Software', 'Marketing', 'Electrical', 'Production', 'HR', 'Finance'];
  const statusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'leave', label: 'On Leave' },
    { value: 'late', label: 'Late' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error on change
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.employeeName.trim()) {
      setError('Employee name is required');
      return false;
    }
    if (!formData.employeeId.trim()) {
      setError('Employee ID is required');
      return false;
    }
    if (!formData.department) {
      setError('Department is required');
      return false;
    }
    if (!formData.date) {
      setError('Date is required');
      return false;
    }
    if (formData.status === 'present' && !formData.checkIn) {
      setError('Check-in time is required for present employees');
      return false;
    }
    if (formData.status === 'leave' && !formData.leaveReason.trim()) {
      setError('Leave reason is required for leave status');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAttendance = {
        id: Date.now(),
        employeeName: formData.employeeName,
        department: formData.department,
        date: formData.date,
        checkIn: formData.status === 'present' ? formData.checkIn : '--',
        checkOut: formData.status === 'present' ? (formData.checkOut || '--') : '--',
        status: formData.status,
        workingHours: formData.status === 'present' ? '8h' : '0h',
        overtime: formData.status === 'present' ? '0h' : '0h',
        avatar: formData.employeeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        leaveReason: formData.status === 'leave' ? formData.leaveReason : undefined,
        remarks: formData.remarks
      };

      onSubmit(newAttendance);
      setLoading(false);
    } catch (error) {
      setError('Failed to save attendance. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="attendance-form">
      {error && (
        <Alert variant="danger" className="mb-3" onClose={() => setError('')} dismissible>
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaUser className="me-2" /> Employee Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="employeeName"
              placeholder="Enter employee name"
              value={formData.employeeName}
              onChange={handleChange}
              isInvalid={!!error && !formData.employeeName}
            />
            <Form.Control.Feedback type="invalid">
              Employee name is required
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Employee ID <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="employeeId"
              placeholder="Enter employee ID"
              value={formData.employeeId}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Department <span className="text-danger">*</span></Form.Label>
            <Form.Select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaCalendarDay className="me-2" /> Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Status <span className="text-danger">*</span></Form.Label>
        <div className="status-options">
          {statusOptions.map(option => (
            <Form.Check
              key={option.value}
              type="radio"
              id={`status-${option.value}`}
              name="status"
              value={option.value}
              label={option.label}
              checked={formData.status === option.value}
              onChange={handleChange}
              inline
              className={`status-option status-${option.value}`}
            />
          ))}
        </div>
      </Form.Group>

      {formData.status === 'present' && (
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaClock className="me-2" /> Check-in Time <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="time"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Check-out Time</Form.Label>
              <Form.Control
                type="time"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
      )}

      {formData.status === 'leave' && (
        <Form.Group className="mb-3">
          <Form.Label>Leave Reason <span className="text-danger">*</span></Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="leaveReason"
            placeholder="Enter reason for leave"
            value={formData.leaveReason}
            onChange={handleChange}
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Remarks</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="remarks"
          placeholder="Additional remarks (optional)"
          value={formData.remarks}
          onChange={handleChange}
        />
      </Form.Group>

      <div className="form-actions">
        <Button 
          variant="secondary" 
          onClick={onCancel}
          disabled={loading}
        >
          <FaTimes className="me-1" /> Cancel
        </Button>
        <Button 
          variant="primary" 
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Saving...
            </>
          ) : (
            <>
              <FaSave className="me-1" /> Save Attendance
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default AttendanceForm;