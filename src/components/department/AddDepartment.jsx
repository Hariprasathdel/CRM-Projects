import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge, ListGroup
} from 'react-bootstrap';
import {
  FaSave, FaTimes, FaBuilding, FaCode, FaUserTie, FaMapMarkerAlt,
  FaDollarSign, FaCalendarAlt, FaUsers, FaPlus, FaTrash,
  FaArrowLeft, FaInfoCircle, FaBriefcase
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AddDepartment.css';

const AddDepartment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    manager: '',
    employeeCount: 0,
    budget: '',
    status: 'Active',
    description: '',
    location: '',
    establishedDate: new Date().toISOString().split('T')[0]
  });

  const [projects, setProjects] = useState(['']);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleProjectChange = (idx, value) => {
    const copy = [...projects];
    copy[idx] = value;
    setProjects(copy);
  };

  const handleAddProject = () => setProjects([...projects, '']);

  const handleRemoveProject = (idx) =>
    setProjects(projects.filter((_, i) => i !== idx));

  const validate = () => {
    if (!formData.name.trim()) { setError('Department name is required'); return false; }
    if (!formData.code.trim()) { setError('Department code is required'); return false; }
    if (formData.code.length > 5) { setError('Code must be 5 characters or less'); return false; }
    if (!formData.manager.trim()) { setError('Manager name is required'); return false; }
    if (!formData.budget || formData.budget <= 0) { setError('Valid budget is required'); return false; }
    if (!formData.location.trim()) { setError('Location is required'); return false; }
    if (!formData.establishedDate) { setError('Established date is required'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess('Department created successfully! Redirecting...');
      setTimeout(() => navigate('/department'), 1500);
    } catch (err) {
      setError('Failed to create department.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '', code: '', manager: '', employeeCount: 0,
      budget: '', status: 'Active', description: '',
      location: '', establishedDate: new Date().toISOString().split('T')[0]
    });
    setProjects(['']);
    setError('');
  };

  return (
    <div className="add-department-page">
      <Container fluid>
        {/* Header */}
        <div className="add-header">
          <div className="header-left">
            <Button variant="outline-secondary" size="sm" className="back-btn"
              onClick={() => navigate('/department')}>
              <FaArrowLeft className="me-1" /> Back
            </Button>
            <div>
              <h2 className="page-title">Add Department</h2>
              <p className="page-subtitle">Create a new department in your organization</p>
            </div>
          </div>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row className="g-4">
            {/* Main Form */}
            <Col lg={8}>
              <Card className="form-card mb-3">
                <Card.Header>
                  <h6 className="mb-0">
                    <FaBuilding className="me-2 text-primary" /> Basic Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Department Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Software Development"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaCode className="me-1" /> Code <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="code"
                          value={formData.code}
                          onChange={handleChange}
                          placeholder="e.g., SWD"
                          maxLength="5"
                          style={{ textTransform: 'uppercase' }}
                        />
                        <Form.Text className="text-muted">Max 5 characters</Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaUserTie className="me-1" /> Manager <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="manager"
                          value={formData.manager}
                          onChange={handleChange}
                          placeholder="Enter manager name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaDollarSign className="me-1" /> Annual Budget <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          placeholder="e.g., 250000"
                          min="0"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaMapMarkerAlt className="me-1" /> Location <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g., Building A, Floor 3"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaCalendarAlt className="me-1" /> Established Date <span className="text-danger">*</span>
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

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaUsers className="me-1" /> Initial Employee Count
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="employeeCount"
                          value={formData.employeeCount}
                          onChange={handleChange}
                          min="0"
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
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the department's purpose and responsibilities..."
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Projects Section */}
              <Card className="form-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    <FaBriefcase className="me-2 text-primary" /> Initial Projects (Optional)
                  </h6>
                  <Button size="sm" variant="outline-primary" onClick={handleAddProject}>
                    <FaPlus className="me-1" /> Add Project
                  </Button>
                </Card.Header>
                <Card.Body>
                  {projects.map((p, i) => (
                    <div key={i} className="array-input-row">
                      <Form.Control
                        type="text"
                        placeholder={`Project name ${i + 1}`}
                        value={p}
                        onChange={(e) => handleProjectChange(i, e.target.value)}
                      />
                      {projects.length > 1 && (
                        <Button variant="outline-danger" size="sm"
                          onClick={() => handleRemoveProject(i)}>
                          <FaTrash />
                        </Button>
                      )}
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            {/* Sidebar */}
            <Col lg={4}>
              <div className="sticky-sidebar">
                {/* Preview */}
                <Card className="preview-card mb-3">
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaInfoCircle className="me-2" /> Live Preview
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="preview-header">
                      <div className="preview-icon">
                        {formData.code || 'DPT'}
                      </div>
                      <div>
                        <div className="preview-name">
                          {formData.name || 'Department Name'}
                        </div>
                        <Badge bg={formData.status === 'Active' ? 'success' : 'secondary'} className="mt-1">
                          {formData.status}
                        </Badge>
                      </div>
                    </div>

                    <ListGroup variant="flush" className="preview-details">
                      <ListGroup.Item>
                        <FaUserTie className="me-2 text-muted" />
                        <span>{formData.manager || 'Manager name'}</span>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FaMapMarkerAlt className="me-2 text-muted" />
                        <span>{formData.location || 'Location'}</span>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FaUsers className="me-2 text-muted" />
                        <span>{formData.employeeCount || 0} employees</span>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FaDollarSign className="me-2 text-muted" />
                        <span>
                          {formData.budget
                            ? `$${parseInt(formData.budget).toLocaleString()}`
                            : 'Budget'}
                        </span>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FaCalendarAlt className="me-2 text-muted" />
                        <span>
                          {formData.establishedDate
                            ? new Date(formData.establishedDate).toLocaleDateString()
                            : 'Established date'}
                        </span>
                      </ListGroup.Item>
                    </ListGroup>
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
                      <><FaSave className="me-1" /> Create Department</>
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

export default AddDepartment;