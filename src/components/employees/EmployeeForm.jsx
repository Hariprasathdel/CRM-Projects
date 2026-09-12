import React, { useState, useEffect } from 'react';
import {
  Form,
  Row,
  Col,
  Button,
  Alert,
  Spinner
} from 'react-bootstrap';
import { FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaBriefcase, FaCalendar, FaDollarSign } from 'react-icons/fa';
import './EmployeeForm.css';

const EmployeeForm = ({ employee, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    joinDate: '',
    status: 'Active',
    salary: '',
    address: '',
    emergencyContact: '',
    skills: '',
    projects: '',
    performance: 'Good'
  });

  const departments = ['Software', 'Marketing', 'Electrical', 'Production', 'HR', 'Finance', 'Sales', 'Operations'];
  const positions = ['Senior Developer', 'Developer', 'Manager', 'Supervisor', 'Coordinator', 'Engineer', 'Analyst', 'Specialist'];
  const statuses = ['Active', 'Leave', 'Inactive'];
  const performances = ['Excellent', 'Good', 'Average', 'Poor'];

  useEffect(() => {
    if (employee) {
      setFormData({
        id: employee.id,
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        position: employee.position || '',
        joinDate: employee.joinDate || '',
        status: employee.status || 'Active',
        salary: employee.salary || '',
        address: employee.address || '',
        emergencyContact: employee.emergencyContact || '',
        skills: employee.skills ? employee.skills.join(', ') : '',
        projects: employee.projects ? employee.projects.join(', ') : '',
        performance: employee.performance || 'Good'
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.department) {
      setError('Department is required');
      return false;
    }
    if (!formData.position) {
      setError('Position is required');
      return false;
    }
    if (!formData.joinDate) {
      setError('Join date is required');
      return false;
    }
    if (!formData.salary || formData.salary <= 0) {
      setError('Valid salary is required');
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
      const skillsArray = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [];
      const projectsArray = formData.projects ? formData.projects.split(',').map(p => p.trim()).filter(p => p) : [];
      
      const employeeData = {
        ...formData,
        skills: skillsArray,
        projects: projectsArray
      };

      await onSubmit(employeeData);
      setLoading(false);
    } catch (error) {
      setError('Failed to save employee. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="employee-form">
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
              <FaUser className="me-2" /> First Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaUser className="me-2" /> Last Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaEnvelope className="me-2" /> Email <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaPhone className="me-2" /> Phone <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaBriefcase className="me-2" /> Department <span className="text-danger">*</span>
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
              <FaBriefcase className="me-2" /> Position <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="position"
              value={formData.position}
              onChange={handleChange}
            >
              <option value="">Select Position</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaCalendar className="me-2" /> Join Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaDollarSign className="me-2" /> Salary <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="salary"
              placeholder="Enter salary"
              value={formData.salary}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="address"
          placeholder="Enter address"
          value={formData.address}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Emergency Contact</Form.Label>
        <Form.Control
          type="text"
          name="emergencyContact"
          placeholder="Enter emergency contact number"
          value={formData.emergencyContact}
          onChange={handleChange}
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Skills (comma separated)</Form.Label>
            <Form.Control
              type="text"
              name="skills"
              placeholder="React, Node.js, Python"
              value={formData.skills}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              Enter skills separated by commas
            </Form.Text>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Projects (comma separated)</Form.Label>
            <Form.Control
              type="text"
              name="projects"
              placeholder="Project A, Project B"
              value={formData.projects}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              Enter projects separated by commas
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Performance</Form.Label>
        <Form.Select
          name="performance"
          value={formData.performance}
          onChange={handleChange}
        >
          {performances.map(perf => (
            <option key={perf} value={perf}>{perf}</option>
          ))}
        </Form.Select>
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
              <FaSave className="me-1" /> 
              {employee ? 'Update Employee' : 'Add Employee'}
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default EmployeeForm;