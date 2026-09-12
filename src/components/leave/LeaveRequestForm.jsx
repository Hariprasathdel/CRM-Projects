import React, { useState, useEffect } from 'react';
import {
  Form,
  Row,
  Col,
  Button,
  Alert,
  Spinner
} from 'react-bootstrap';
import { 
  FaSave, 
  FaTimes, 
  FaUser, 
  FaCalendarAlt, 
  FaClock, 
  FaComment,
  FaBuilding,
  FaFileAlt
} from 'react-icons/fa';
import './LeaveRequestForm.css';

const LeaveRequestForm = ({ leave, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    type: 'Annual',
    startDate: '',
    endDate: '',
    totalDays: 1,
    reason: '',
    remarks: ''
  });

  const leaveTypes = ['Annual', 'Sick', 'Emergency', 'Personal', 'Maternity', 'Paternity'];
  const departments = ['Software', 'Marketing', 'Electrical', 'Production', 'HR', 'Finance'];
  const employees = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Robert Brown', 'Emily Davis'];

  useEffect(() => {
    if (leave) {
      setFormData({
        id: leave.id,
        employeeName: leave.employeeName || '',
        employeeId: leave.employeeId || '',
        department: leave.department || '',
        type: leave.type || 'Annual',
        startDate: leave.startDate || '',
        endDate: leave.endDate || '',
        totalDays: leave.totalDays || 1,
        reason: leave.reason || '',
        remarks: leave.remarks || ''
      });
    }
  }, [leave]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Calculate total days when dates change
    if (name === 'startDate' || name === 'endDate') {
      calculateTotalDays();
    }
    
    if (error) setError('');
  };

  const calculateTotalDays = () => {
    const { startDate, endDate } = formData;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setFormData(prev => ({
        ...prev,
        totalDays: diffDays
      }));
    }
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
    if (!formData.type) {
      setError('Leave type is required');
      return false;
    }
    if (!formData.startDate) {
      setError('Start date is required');
      return false;
    }
    if (!formData.endDate) {
      setError('End date is required');
      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('Start date must be before end date');
      return false;
    }
    if (formData.totalDays <= 0) {
      setError('Total days must be greater than 0');
      return false;
    }
    if (!formData.reason.trim()) {
      setError('Reason is required');
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
      await onSubmit(formData);
      setLoading(false);
    } catch (error) {
      setError('Failed to submit leave application. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="leave-request-form">
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
              list="employeeList"
            />
            <datalist id="employeeList">
              {employees.map((emp, index) => (
                <option key={index} value={emp} />
              ))}
            </datalist>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaFileAlt className="me-2" /> Employee ID <span className="text-danger">*</span>
            </Form.Label>
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
            <Form.Label>
              <FaBuilding className="me-2" /> Department <span className="text-danger">*</span>
            </Form.Label>
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
              <FaClock className="me-2" /> Leave Type <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              {leaveTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaCalendarAlt className="me-2" /> Start Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaCalendarAlt className="me-2" /> End Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaClock className="me-2" /> Total Days
            </Form.Label>
            <Form.Control
              type="number"
              name="totalDays"
              value={formData.totalDays}
              onChange={handleChange}
              readOnly={!!leave}
              min="1"
            />
            <Form.Text className="text-muted">
              Auto-calculated from dates
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>
          <FaComment className="me-2" /> Reason <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="reason"
          placeholder="Enter reason for leave"
          value={formData.reason}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          <FaComment className="me-2" /> Remarks (Optional)
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="remarks"
          placeholder="Additional remarks"
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
              Submitting...
            </>
          ) : (
            <>
              <FaSave className="me-1" /> 
              {leave ? 'Update Application' : 'Submit Application'}
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default LeaveRequestForm;