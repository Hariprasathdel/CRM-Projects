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
  FaProjectDiagram, 
  FaCode, 
  FaUser, 
  FaBuilding,
  FaCalendarAlt,
  FaDollarSign,
  FaTasks,
  FaUsers
} from 'react-icons/fa';
import './ProjectForm.css';

const ProjectForm = ({ project, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    department: '',
    manager: '',
    startDate: '',
    endDate: '',
    status: 'Planned',
    priority: 'Medium',
    budget: '',
    teamMembers: '',
    tasks: 0
  });

  const departments = ['Software', 'Marketing', 'Electrical', 'Production', 'HR', 'Finance'];
  const statuses = ['Planned', 'In Progress', 'On Hold', 'Completed'];
  const priorities = ['Low', 'Medium', 'High'];
  const managers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Robert Brown', 'Emily Davis'];

  useEffect(() => {
    if (project) {
      setFormData({
        id: project.id,
        name: project.name || '',
        code: project.code || '',
        description: project.description || '',
        department: project.department || '',
        manager: project.manager || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        status: project.status || 'Planned',
        priority: project.priority || 'Medium',
        budget: project.budget || '',
        teamMembers: project.teamMembers ? project.teamMembers.join(', ') : '',
        tasks: project.tasks || 0
      });
    }
  }, [project]);

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
      setError('Project name is required');
      return false;
    }
    if (!formData.code.trim()) {
      setError('Project code is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.department) {
      setError('Department is required');
      return false;
    }
    if (!formData.manager.trim()) {
      setError('Manager name is required');
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
    if (!formData.budget || formData.budget <= 0) {
      setError('Valid budget is required');
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
      // Convert comma-separated string to array
      const teamMembersArray = formData.teamMembers ? 
        formData.teamMembers.split(',').map(m => m.trim()).filter(m => m) : [];
      
      const projectData = {
        ...formData,
        teamMembers: teamMembersArray
      };

      await onSubmit(projectData);
      setLoading(false);
    } catch (error) {
      setError('Failed to save project. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="project-form">
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
              <FaProjectDiagram className="me-2" /> Project Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaCode className="me-2" /> Project Code <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="code"
              placeholder="e.g., PRJ-2026"
              value={formData.code}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Description <span className="text-danger">*</span></Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          placeholder="Enter project description"
          value={formData.description}
          onChange={handleChange}
        />
      </Form.Group>

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
              <FaUser className="me-2" /> Manager <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="manager"
              placeholder="Enter manager name"
              value={formData.manager}
              onChange={handleChange}
              list="managerList"
            />
            <datalist id="managerList">
              {managers.map((mgr, index) => (
                <option key={index} value={mgr} />
              ))}
            </datalist>
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
              <FaDollarSign className="me-2" /> Budget <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="budget"
              placeholder="Enter budget"
              value={formData.budget}
              onChange={handleChange}
              min="0"
              step="1000"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
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

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaTasks className="me-2" /> Total Tasks
            </Form.Label>
            <Form.Control
              type="number"
              name="tasks"
              placeholder="Number of tasks"
              value={formData.tasks}
              onChange={handleChange}
              min="0"
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>
          <FaUsers className="me-2" /> Team Members (comma separated)
        </Form.Label>
        <Form.Control
          type="text"
          name="teamMembers"
          placeholder="John Doe, Jane Smith, Mike Johnson"
          value={formData.teamMembers}
          onChange={handleChange}
        />
        <Form.Text className="text-muted">
          Enter team member names separated by commas
        </Form.Text>
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
              {project ? 'Update Project' : 'Create Project'}
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default ProjectForm;