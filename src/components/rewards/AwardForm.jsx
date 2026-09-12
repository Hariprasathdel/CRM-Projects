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
  FaGift, 
  FaStar,
  FaBuilding,
  FaTrophy,
  FaMedal,
  FaFileAlt
} from 'react-icons/fa';
import './AwardForm.css';

const AwardForm = ({ award, employees, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    awardName: '',
    awardType: 'Certificate',
    points: 50,
    date: '',
    reason: '',
    status: 'Pending',
    approvedBy: ''
  });

  const awardTypes = [
    { value: 'Certificate', label: 'Certificate', icon: <FaTrophy /> },
    { value: 'Monetary', label: 'Monetary', icon: <FaMedal /> },
    { value: 'Recognition', label: 'Recognition', icon: <FaStar /> },
    { value: 'Team Award', label: 'Team Award', icon: <FaGift /> }
  ];

  const pointOptions = [25, 50, 75, 100, 125, 150, 200];

  useEffect(() => {
    if (award) {
      setFormData({
        id: award.id,
        employeeName: award.employeeName || '',
        employeeId: award.employeeId || '',
        department: award.department || '',
        awardName: award.awardName || '',
        awardType: award.awardType || 'Certificate',
        points: award.points || 50,
        date: award.date || '',
        reason: award.reason || '',
        status: award.status || 'Pending',
        approvedBy: award.approvedBy || ''
      });
    }
  }, [award]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-fill employee details when employee name is selected
    if (name === 'employeeName') {
      const employee = employees.find(emp => emp.name === value);
      if (employee) {
        setFormData(prev => ({
          ...prev,
          employeeId: `EMP${String(employee.id).padStart(3, '0')}`,
          department: employee.department
        }));
      }
    }
    
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.employeeName.trim()) {
      setError('Employee name is required');
      return false;
    }
    if (!formData.awardName.trim()) {
      setError('Award name is required');
      return false;
    }
    if (!formData.awardType) {
      setError('Award type is required');
      return false;
    }
    if (!formData.points || formData.points <= 0) {
      setError('Valid points are required');
      return false;
    }
    if (!formData.date) {
      setError('Date is required');
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
      setError('Failed to save award. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="award-form">
      {error && (
        <Alert variant="danger" className="mb-3" onClose={() => setError('')} dismissible>
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      <Row>
        <Col md={8}>
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
              disabled={!!award}
            />
            <datalist id="employeeList">
              {employees.map((emp, index) => (
                <option key={index} value={emp.name} />
              ))}
            </datalist>
            <Form.Text className="text-muted">
              Start typing to search for employees
            </Form.Text>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Employee ID</Form.Label>
            <Form.Control
              type="text"
              name="employeeId"
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
            <Form.Label>
              <FaBuilding className="me-2" /> Department
            </Form.Label>
            <Form.Control
              type="text"
              name="department"
              value={formData.department}
              readOnly
              className="readonly-field"
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaGift className="me-2" /> Award Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="awardName"
              placeholder="Enter award name"
              value={formData.awardName}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaTrophy className="me-2" /> Award Type <span className="text-danger">*</span>
            </Form.Label>
            <div className="award-type-options">
              {awardTypes.map(type => (
                <div
                  key={type.value}
                  className={`award-type-option ${formData.awardType === type.value ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, awardType: type.value }))}
                >
                  <span className="award-type-icon">{type.icon}</span>
                  <span className="award-type-label">{type.label}</span>
                </div>
              ))}
            </div>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaStar className="me-2" /> Points <span className="text-danger">*</span>
            </Form.Label>
            <div className="points-options">
              {pointOptions.map(points => (
                <div
                  key={points}
                  className={`points-option ${formData.points === points ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, points }))}
                >
                  {points}
                </div>
              ))}
            </div>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaFileAlt className="me-2" /> Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={!!award}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>
          <FaFileAlt className="me-2" /> Reason <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="reason"
          placeholder="Enter reason for this award"
          value={formData.reason}
          onChange={handleChange}
        />
      </Form.Group>

      {formData.approvedBy && (
        <Form.Group className="mb-3">
          <Form.Label>Approved By</Form.Label>
          <Form.Control
            type="text"
            value={formData.approvedBy}
            readOnly
            className="readonly-field"
          />
        </Form.Group>
      )}

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
              <FaSave className="me-1" /> 
              {award ? 'Update Award' : 'Give Award'}
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default AwardForm;   