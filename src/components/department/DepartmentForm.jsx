import React, { useState, useEffect } from 'react';
import {
  Form,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
  Badge
} from 'react-bootstrap';
import { 
  FaSave, 
  FaTimes, 
  FaBuilding, 
  FaCode, 
  FaUser, 
  FaMapMarker, 
  FaDollarSign,
  FaCalendar,
  FaUsers
} from 'react-icons/fa';
import './DepartmentForm.css';

const DepartmentForm = ({ department, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    manager: '',
    employeeCount: 0,
    budget: '',
    status: 'Active',
    description: '',
    location: '',
    establishedDate: '',
    projects: '',
    employees: ''
  });

  const statuses = ['Active', 'Inactive'];

  useEffect(() => {
    if (department) {
      setFormData({
        id: department.id,
        name: department.name || '',
        code: department.code || '',
        manager: department.manager || '',
        employeeCount: department.employeeCount || 0,
        budget: department.budget || '',
        status: department.status || 'Active',
        description: department.description || '',
        location: department.location || '',
        establishedDate: department.establishedDate || '',
        projects: department.projects ? department.projects.join(', ') : '',
        employees: department.employees ? department.employees.join(', ') : ''
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Department name is required');
      return false;
    }
    if (!formData.code.trim()) {
      setError('Department code is required');
      return false;
    }
    if (formData.code.trim().length > 5) {
      setError('Department code must be 5 characters or less');
      return false;
    }
    if (!formData.manager.trim()) {
      setError('Manager name is required');
      return false;
    }
    if (!formData.budget || formData.budget <= 0) {
      setError('Valid budget is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (!formData.establishedDate) {
      setError('Established date is required');
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
      // Convert comma-separated strings to arrays
      const projectsArray = formData.projects ? 
        formData.projects.split(',').map(p => p.trim()).filter(p => p) : [];
      const employeesArray = formData.employees ? 
        formData.employees.split(',').map(e => e.trim()).filter(e => e) : [];
      
      const departmentData = {
        ...formData,
        projects: projectsArray,
        employees: employeesArray,
        employeeCount: employeesArray.length || formData.employeeCount || 0
      };

      await onSubmit(departmentData);
      setLoading(false);
    } catch (error) {
      setError('Failed to save department. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="department-form">
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
              <FaBuilding className="me-2" /> Department Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter department name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaCode className="me-2" /> Department Code <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="code"
              placeholder="e.g., SWD"
              value={formData.code}
              onChange={handleChange}
              maxLength="5"
            />
            <Form.Text className="text-muted">
              Maximum 5 characters (e.g., SWD, MKT, HR)
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaUser className="me-2" /> Manager <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="manager"
              placeholder="Enter manager name"
              value={formData.manager}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaDollarSign className="me-2" /> Budget <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="budget"
              placeholder="Enter annual budget"
              value={formData.budget}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaMapMarker className="me-2" /> Location <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="location"
              placeholder="e.g., Building A, Floor 3"
              value={formData.location}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaCalendar className="me-2" /> Established Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="establishedDate"
              value={formData.establishedDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>
          <FaUsers className="me-2" /> Status
        </Form.Label>
        <Form.Select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          placeholder="Enter department description"
          value={formData.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Projects (comma separated)</Form.Label>
            <Form.Control
              type="text"
              name="projects"
              placeholder="Project A, Project B, Project C"
              value={formData.projects}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              Enter projects separated by commas
            </Form.Text>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Team Members (comma separated)</Form.Label>
            <Form.Control
              type="text"
              name="employees"
              placeholder="John Doe, Jane Smith, Mike Johnson"
              value={formData.employees}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              Enter team member names separated by commas
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

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
              {department ? 'Update Department' : 'Add Department'}
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default DepartmentForm;