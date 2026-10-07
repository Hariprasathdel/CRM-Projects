import React, { useState, useEffect } from 'react';
import {
  Form, Row, Col, Button, Alert, Spinner, InputGroup, Badge
} from 'react-bootstrap';
import {
  FaSave, FaTimes, FaUser, FaCalendarAlt, FaClock,
  FaMapMarkerAlt, FaCheckCircle, FaTimesCircle,
  FaUserClock, FaComment, FaInfoCircle
} from 'react-icons/fa';
import './AttendanceForm.css';

const AttendanceForm = ({ record, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isViewMode, setIsViewMode] = useState(false);

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    position: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    status: 'present',
    workingHours: '',
    overtime: '',
    location: 'Main Office',
    remarks: ''
  });

  // ==================== EMPLOYEES ====================
  const employees = [
    { id: 1, name: 'John Doe', department: 'Software', position: 'Senior Developer' },
    { id: 2, name: 'Jane Smith', department: 'Marketing', position: 'Marketing Manager' },
    { id: 3, name: 'Mike Johnson', department: 'Electrical', position: 'Electrical Engineer' },
    { id: 4, name: 'Sarah Williams', department: 'Production', position: 'Production Supervisor' },
    { id: 5, name: 'Robert Brown', department: 'Software', position: 'Frontend Developer' },
    { id: 6, name: 'Emily Davis', department: 'HR', position: 'HR Coordinator' }
  ];

  const statusOptions = [
    { value: 'present', label: 'Present', icon: <FaCheckCircle />, color: 'success' },
    { value: 'absent',  label: 'Absent',  icon: <FaTimesCircle />, color: 'danger' },
    { value: 'leave',   label: 'Leave',   icon: <FaUserClock />, color: 'warning' },
    { value: 'late',    label: 'Late',    icon: <FaClock />, color: 'info' }
  ];

  const locations = ['Main Office', 'Remote', 'Branch Office', 'Client Site'];

  // ==================== LOAD EDIT DATA ====================
  useEffect(() => {
    if (record) {
      setFormData({
        id: record.id,
        employeeName: record.employeeName || '',
        employeeId: record.employeeId || '',
        department: record.department || '',
        position: record.position || '',
        date: record.date || new Date().toISOString().split('T')[0],
        checkIn: convertTo24h(record.checkIn),
        checkOut: convertTo24h(record.checkOut),
        status: record.status || 'present',
        workingHours: record.workingHours || '',
        overtime: record.overtime || '',
        location: record.location || 'Main Office',
        remarks: record.remarks || ''
      });
      setIsViewMode(false);
    }
  }, [record]);

  // ==================== TIME CONVERTER ====================
  const convertTo24h = (time12) => {
    if (!time12 || time12 === '--') return '';
    // If already 24h format (HH:mm)
    if (/^\d{2}:\d{2}$/.test(time12)) return time12;
    // Convert "09:00 AM" -> "09:00"
    const [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    if (modifier === 'PM' && hours !== '12') hours = String(parseInt(hours, 10) + 12);
    if (modifier === 'AM' && hours === '12') hours = '00';
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  const convertTo12h = (time24) => {
    if (!time24) return '--';
    const [h, m] = time24.split(':');
    const hour = parseInt(h, 10);
    const modifier = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${m} ${modifier}`;
  };

  // ==================== HANDLERS ====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-fill employee details
    if (name === 'employeeName') {
      const emp = employees.find((x) => x.name === value);
      if (emp) {
        setFormData((prev) => ({
          ...prev,
          employeeId: `EMP${String(emp.id).padStart(3, '0')}`,
          department: emp.department,
          position: emp.position
        }));
      }
    }

    // Auto-calculate working hours
    if (name === 'checkIn' || name === 'checkOut') {
      setTimeout(() => calculateHours(), 0);
    }

    if (error) setError('');
  };

  const calculateHours = () => {
    const { checkIn, checkOut } = formData;
    if (checkIn && checkOut) {
      const [h1, m1] = checkIn.split(':').map(Number);
      const [h2, m2] = checkOut.split(':').map(Number);
      const totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
      if (totalMinutes > 0) {
        const hours = (totalMinutes / 60).toFixed(1);
        setFormData((prev) => ({ ...prev, workingHours: `${hours}h` }));
      }
    }
  };

  const handleStatusChange = (status) => {
    setFormData((prev) => ({
      ...prev,
      status,
      // Clear check-in/out for non-present statuses
      ...(status !== 'present' && status !== 'late'
        ? { checkIn: '', checkOut: '', workingHours: '', overtime: '' }
        : {})
    }));
  };

  const setCurrentTime = (field) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setFormData((prev) => ({ ...prev, [field]: time }));
    setTimeout(() => calculateHours(), 0);
  };

  // ==================== VALIDATION ====================
  const validate = () => {
    if (!formData.employeeName.trim()) {
      setError('Please select an employee');
      return false;
    }
    if (!formData.date) {
      setError('Please select a date');
      return false;
    }
    if ((formData.status === 'present' || formData.status === 'late') && !formData.checkIn) {
      setError('Please enter check-in time');
      return false;
    }
    return true;
  };

  // ==================== SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        checkIn: convertTo12h(formData.checkIn),
        checkOut: convertTo12h(formData.checkOut)
      };
      await onSubmit(submitData);
      setLoading(false);
    } catch (err) {
      setError('Failed to save attendance.');
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Form onSubmit={handleSubmit} className="attendance-form">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Employee Info */}
      <h6 className="form-section-title">
        <FaUser className="me-2" /> Employee Information
      </h6>

      <Row>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label>
              Employee Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="employeeName"
              placeholder="Select or type employee name"
              value={formData.employeeName}
              onChange={handleChange}
              list="attendanceEmployeeList"
              disabled={!!record}
            />
            <datalist id="attendanceEmployeeList">
              {employees.map((emp, i) => (
                <option key={i} value={emp.name} />
              ))}
            </datalist>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Employee ID</Form.Label>
            <Form.Control
              type="text"
              value={formData.employeeId}
              readOnly
              className="readonly-field"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              value={formData.department}
              readOnly
              className="readonly-field"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Position</Form.Label>
            <Form.Control
              type="text"
              value={formData.position}
              readOnly
              className="readonly-field"
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Date & Time */}
      <h6 className="form-section-title">
        <FaCalendarAlt className="me-2" /> Date & Time
      </h6>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={today}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaClock className="me-1" /> Check In
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="time"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
              />
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setCurrentTime('checkIn')}
                type="button"
              >
                Now
              </Button>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaClock className="me-1" /> Check Out
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="time"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
              />
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setCurrentTime('checkOut')}
                type="button"
              >
                Now
              </Button>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      {/* Status */}
      <h6 className="form-section-title">
        <FaInfoCircle className="me-2" /> Attendance Status
      </h6>

      <Form.Group className="mb-3">
        <Row>
          {statusOptions.map((opt) => (
            <Col md={3} sm={6} key={opt.value} className="mb-2">
              <div
                className={`status-card status-${opt.color} ${formData.status === opt.value ? 'active' : ''}`}
                onClick={() => handleStatusChange(opt.value)}
              >
                <div className={`status-icon bg-${opt.color}`}>
                  {opt.icon}
                </div>
                <span className="status-label">{opt.label}</span>
              </div>
            </Col>
          ))}
        </Row>
      </Form.Group>

      {/* Conditional Fields */}
      {(formData.status === 'present' || formData.status === 'late') && (
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Working Hours</Form.Label>
              <Form.Control
                type="text"
                value={formData.workingHours}
                readOnly
                className="readonly-field"
                placeholder="Auto-calculated"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Overtime</Form.Label>
              <Form.Control
                type="text"
                name="overtime"
                value={formData.overtime}
                onChange={handleChange}
                placeholder="e.g., 1.5h"
              />
            </Form.Group>
          </Col>
        </Row>
      )}

      {/* Location */}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaMapMarkerAlt className="me-1" /> Location
            </Form.Label>
            <Form.Select
              name="location"
              value={formData.location}
              onChange={handleChange}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Remarks */}
      <Form.Group className="mb-3">
        <Form.Label>
          <FaComment className="me-1" /> Remarks
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Add any additional notes..."
        />
      </Form.Group>

      {/* Actions */}
      <div className="form-actions">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          type="button"
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
              <FaSave className="me-1" />
              {record ? 'Update Attendance' : 'Mark Attendance'}
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default AttendanceForm;