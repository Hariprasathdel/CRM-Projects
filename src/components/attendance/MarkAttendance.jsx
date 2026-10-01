import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner,
  Badge, Table, InputGroup, ListGroup
} from 'react-bootstrap';
import {
  FaUser, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle,
  FaUserClock, FaSave, FaTimes, FaArrowLeft, FaInfoCircle,
  FaMapMarkerAlt, FaPlus, FaTrash, FaUsers, FaCheck,
  FaBullseye, FaSync
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './MarkAttendance.css';

const MarkAttendance = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    status: 'present',
    leaveType: '',
    reason: '',
    remarks: '',
    location: 'Main Office'
  });

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
    { value: 'leave',   label: 'On Leave', icon: <FaUserClock />, color: 'warning' },
    { value: 'late',    label: 'Late',    icon: <FaClock />, color: 'info' }
  ];

  const leaveTypes = ['Annual', 'Sick', 'Emergency', 'Personal', 'Maternity', 'Paternity', 'Unpaid'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');

    if (name === 'employeeName') {
      const emp = employees.find((x) => x.name === value);
      if (emp) {
        setFormData((prev) => ({
          ...prev,
          employeeId: `EMP${String(emp.id).padStart(3, '0')}`,
          department: emp.department
        }));
      }
    }
  };

  const handleStatusChange = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const validate = () => {
    if (!formData.employeeName) { setError('Please select an employee'); return false; }
    if (!formData.date) { setError('Please select a date'); return false; }
    if (formData.status === 'present' && !formData.checkIn) {
      setError('Please enter check-in time'); return false;
    }
    if (formData.status === 'leave' && !formData.leaveType) {
      setError('Please select a leave type'); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(`Attendance marked as "${formData.status}" for ${formData.employeeName}`);
      setTimeout(() => navigate('/attendance'), 2000);
    } catch (err) {
      setError('Failed to mark attendance.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      employeeName: '', employeeId: '', department: '',
      date: new Date().toISOString().split('T')[0],
      checkIn: '', checkOut: '', status: 'present',
      leaveType: '', reason: '', remarks: '', location: 'Main Office'
    });
    setError('');
  };

  const setCurrentTime = (field) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setFormData((prev) => ({ ...prev, [field]: time }));
  };

  return (
    <div className="mark-attendance-page">
      <Container fluid>
        {/* Header */}
        <div className="mark-header">
          <div className="header-left">
            <Button variant="outline-secondary" size="sm" className="back-btn"
              onClick={() => navigate('/attendance')}>
              <FaArrowLeft className="me-1" /> Back
            </Button>
            <div>
              <h2 className="page-title">Mark Attendance</h2>
              <p className="page-subtitle">Record attendance for an employee</p>
            </div>
          </div>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row className="g-4">
            {/* Main Form */}
            <Col lg={8}>
              {/* Employee */}
              <Card className="form-card mb-3">
                <Card.Header>
                  <h6 className="mb-0"><FaUser className="me-2 text-primary" /> Employee Information</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Employee <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="employeeName"
                          value={formData.employeeName}
                          onChange={handleChange}
                          placeholder="Select employee"
                          list="employeeList"
                        />
                        <datalist id="employeeList">
                          {employees.map((e, i) => <option key={i} value={e.name} />)}
                        </datalist>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Employee ID</Form.Label>
                        <Form.Control type="text" value={formData.employeeId} readOnly className="readonly-field" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Department</Form.Label>
                        <Form.Control type="text" value={formData.department} readOnly className="readonly-field" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label><FaMapMarkerAlt className="me-1" /> Location</Form.Label>
                        <Form.Select name="location" value={formData.location} onChange={handleChange}>
                          <option value="Main Office">Main Office</option>
                          <option value="Remote">Remote</option>
                          <option value="Branch Office">Branch Office</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Date & Time */}
              <Card className="form-card mb-3">
                <Card.Header>
                  <h6 className="mb-0"><FaCalendarAlt className="me-2 text-primary" /> Date & Time</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label><FaClock className="me-1" /> Check In</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="time"
                            name="checkIn"
                            value={formData.checkIn}
                            onChange={handleChange}
                          />
                          <Button variant="outline-primary" size="sm"
                            onClick={() => setCurrentTime('checkIn')}>
                            Now
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label><FaClock className="me-1" /> Check Out</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="time"
                            name="checkOut"
                            value={formData.checkOut}
                            onChange={handleChange}
                          />
                          <Button variant="outline-primary" size="sm"
                            onClick={() => setCurrentTime('checkOut')}>
                            Now
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Status */}
              <Card className="form-card mb-3">
                <Card.Header>
                  <h6 className="mb-0"><FaBullseye className="me-2 text-primary" /> Attendance Status</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {statusOptions.map((opt) => (
                      <Col md={3} sm={6} key={opt.value} className="mb-2">
                        <div
                          className={`status-card ${formData.status === opt.value ? 'active' : ''} status-${opt.color}`}
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

                  {formData.status === 'leave' && (
                    <Form.Group className="mt-3">
                      <Form.Label>Leave Type <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleChange}
                      >
                        <option value="">Select Leave Type</option>
                        {leaveTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                      </Form.Select>
                    </Form.Group>
                  )}

                  {(formData.status === 'absent' || formData.status === 'leave' || formData.status === 'late') && (
                    <Form.Group className="mt-3">
                      <Form.Label>Reason {formData.status === 'late' ? '(Optional)' : ''}</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder={`Reason for ${formData.status}...`}
                      />
                    </Form.Group>
                  )}
                </Card.Body>
              </Card>

              {/* Remarks */}
              <Card className="form-card">
                <Card.Header>
                  <h6 className="mb-0">Remarks (Optional)</h6>
                </Card.Header>
                <Card.Body>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Any additional notes..."
                  />
                </Card.Body>
              </Card>
            </Col>

            {/* Sidebar */}
            <Col lg={4}>
              <div className="sticky-sidebar">
                {/* Preview */}
                <Card className="preview-card mb-3">
                  <Card.Header>
                    <h6 className="mb-0"><FaInfoCircle className="me-2" /> Live Preview</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="preview-header">
                      <div className="preview-avatar">
                        {formData.employeeName
                          ? formData.employeeName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                          : 'EM'}
                      </div>
                      <div>
                        <div className="preview-name">{formData.employeeName || 'Employee Name'}</div>
                        <div className="preview-dept">{formData.department || 'Department'}</div>
                      </div>
                    </div>

                    <ListGroup variant="flush" className="preview-details">
                      <ListGroup.Item>
                        <FaCalendarAlt className="me-2 text-muted" />
                        <span>{formData.date}</span>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FaClock className="me-2 text-muted" />
                        <span>
                          {formData.checkIn || '--:--'} → {formData.checkOut || '--:--'}
                        </span>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FaMapMarkerAlt className="me-2 text-muted" />
                        <span>{formData.location}</span>
                      </ListGroup.Item>
                    </ListGroup>

                    <div className="preview-status">
                      <Badge
                        bg={statusOptions.find((s) => s.value === formData.status)?.color || 'secondary'}
                        className="preview-badge"
                      >
                        {statusOptions.find((s) => s.value === formData.status)?.icon}
                        {' '}
                        {statusOptions.find((s) => s.value === formData.status)?.label}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>

                {/* Actions */}
                <div className="form-actions">
                  <Button variant="secondary" type="button" className="me-2"
                    onClick={handleReset} disabled={loading}>
                    <FaTimes className="me-1" /> Reset
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <><Spinner animation="border" size="sm" className="me-2" />Saving...</>
                    ) : (
                      <><FaSave className="me-1" /> Mark Attendance</>
                    )}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default MarkAttendance;