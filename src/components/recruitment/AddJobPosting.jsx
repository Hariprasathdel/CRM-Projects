import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import {
  FaSave, FaTimes, FaBriefcase, FaMapMarkerAlt, FaDollarSign,
  FaCalendarAlt, FaPlus, FaTrash, FaUserPlus, FaArrowLeft
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import recruitmentService from '../../services/recruitmentService';
import './AddJobPosting.css';

const AddJobPosting = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    experience: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    deadline: '',
    status: 'Active'
  });

  const [requirements, setRequirements] = useState(['']);
  const [responsibilities, setResponsibilities] = useState(['']);
  const [benefits, setBenefits] = useState(['']);

  const departments = ['Software', 'Marketing', 'Electrical', 'Production', 'HR', 'Finance'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleArrayChange = (setter, arr, idx, value) => {
    const copy = [...arr];
    copy[idx] = value;
    setter(copy);
  };

  const handleArrayAdd = (setter, arr) => setter([...arr, '']);

  const handleArrayRemove = (setter, arr, idx) =>
    setter(arr.filter((_, i) => i !== idx));

  const validate = () => {
    if (!formData.title.trim()) return setError('Job title is required'), false;
    if (!formData.department) return setError('Department is required'), false;
    if (!formData.location.trim()) return setError('Location is required'), false;
    if (!formData.experience.trim()) return setError('Experience is required'), false;
    if (!formData.salaryMin || !formData.salaryMax) return setError('Salary range is required'), false;
    if (!formData.description.trim()) return setError('Description is required'), false;
    if (!formData.deadline) return setError('Deadline is required'), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const jobPayload = {
        jobTitle: formData.title,
        department: formData.department,
        vacancies: 1,
        description: formData.description,
        requirements: requirements.filter(r => r.trim()),
        responsibilities: responsibilities.filter(r => r.trim()),
        skills: [formData.department, formData.experience],
        workLocation: formData.location,
        employmentType: formData.type === 'Full-time' ? 'full_time' : formData.type.toLowerCase().replace('-', '_'),
        salaryRange: {
          min: Number(formData.salaryMin) || 60000,
          max: Number(formData.salaryMax) || 90000
        },
        status: 'open'
      };

      const res = await recruitmentService.createJob(jobPayload);
      if (res.success) {
        setSuccess('Job posting created and saved to MongoDB successfully!');
        setTimeout(() => navigate('/recruitment'), 1200);
      } else {
        setError(res.error?.message || 'Failed to save job posting to MongoDB');
      }
    } catch (err) {
      setError('Failed to create job posting.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '', department: '', location: '', type: 'Full-time',
      experience: '', salaryMin: '', salaryMax: '', description: '',
      deadline: '', status: 'Active'
    });
    setRequirements(['']);
    setResponsibilities(['']);
    setBenefits(['']);
    setError('');
  };

  return (
    <div className="add-job-page">
      <Container fluid>
        {/* Header */}
        <div className="add-job-header">
          <div className="header-left">
            <Button variant="outline-secondary" size="sm" className="back-btn"
              onClick={() => navigate('/recruitment')}>
              <FaArrowLeft className="me-1" /> Back
            </Button>
            <div>
              <h2 className="page-title">Add Job Posting</h2>
              <p className="page-subtitle">Create a new job opening</p>
            </div>
          </div>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row className="g-4">
            {/* Basic Info */}
            <Col lg={8}>
              <Card className="form-card mb-3">
                <Card.Header>
                  <h6 className="mb-0"><FaBriefcase className="me-2 text-primary" /> Job Information</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>Job Title <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" name="title" value={formData.title}
                          onChange={handleChange} placeholder="e.g., Senior Software Engineer" />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Department <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="department" value={formData.department} onChange={handleChange}>
                          <option value="">Select Department</option>
                          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label><FaMapMarkerAlt className="me-1" /> Location <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" name="location" value={formData.location}
                          onChange={handleChange} placeholder="e.g., New York, NY or Remote" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Job Type <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="type" value={formData.type} onChange={handleChange}>
                          {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Experience <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" name="experience" value={formData.experience}
                          onChange={handleChange} placeholder="e.g., 3-5 years" />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label><FaDollarSign className="me-1" /> Min Salary <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="number" name="salaryMin" value={formData.salaryMin}
                          onChange={handleChange} placeholder="50000" />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label><FaDollarSign className="me-1" /> Max Salary <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="number" name="salaryMax" value={formData.salaryMax}
                          onChange={handleChange} placeholder="80000" />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                    <Form.Control as="textarea" rows={4} name="description"
                      value={formData.description} onChange={handleChange}
                      placeholder="Describe the role and what the candidate will do..." />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Requirements */}
              <Card className="form-card mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Requirements</h6>
                  <Button size="sm" variant="outline-primary"
                    onClick={() => handleArrayAdd(setRequirements, requirements)}>
                    <FaPlus className="me-1" /> Add
                  </Button>
                </Card.Header>
                <Card.Body>
                  {requirements.map((r, i) => (
                    <div key={i} className="array-input-row">
                      <Form.Control
                        type="text"
                        placeholder={`Requirement ${i + 1}`}
                        value={r}
                        onChange={(e) => handleArrayChange(setRequirements, requirements, i, e.target.value)}
                      />
                      {requirements.length > 1 && (
                        <Button variant="outline-danger" size="sm"
                          onClick={() => handleArrayRemove(setRequirements, requirements, i)}>
                          <FaTrash />
                        </Button>
                      )}
                    </div>
                  ))}
                </Card.Body>
              </Card>

              {/* Responsibilities */}
              <Card className="form-card mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Responsibilities</h6>
                  <Button size="sm" variant="outline-primary"
                    onClick={() => handleArrayAdd(setResponsibilities, responsibilities)}>
                    <FaPlus className="me-1" /> Add
                  </Button>
                </Card.Header>
                <Card.Body>
                  {responsibilities.map((r, i) => (
                    <div key={i} className="array-input-row">
                      <Form.Control
                        type="text"
                        placeholder={`Responsibility ${i + 1}`}
                        value={r}
                        onChange={(e) => handleArrayChange(setResponsibilities, responsibilities, i, e.target.value)}
                      />
                      {responsibilities.length > 1 && (
                        <Button variant="outline-danger" size="sm"
                          onClick={() => handleArrayRemove(setResponsibilities, responsibilities, i)}>
                          <FaTrash />
                        </Button>
                      )}
                    </div>
                  ))}
                </Card.Body>
              </Card>

              {/* Benefits */}
              <Card className="form-card mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Benefits</h6>
                  <Button size="sm" variant="outline-primary"
                    onClick={() => handleArrayAdd(setBenefits, benefits)}>
                    <FaPlus className="me-1" /> Add
                  </Button>
                </Card.Header>
                <Card.Body>
                  {benefits.map((r, i) => (
                    <div key={i} className="array-input-row">
                      <Form.Control
                        type="text"
                        placeholder={`Benefit ${i + 1}`}
                        value={r}
                        onChange={(e) => handleArrayChange(setBenefits, benefits, i, e.target.value)}
                      />
                      {benefits.length > 1 && (
                        <Button variant="outline-danger" size="sm"
                          onClick={() => handleArrayRemove(setBenefits, benefits, i)}>
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
                <Card className="form-card mb-3">
                  <Card.Header>
                    <h6 className="mb-0"><FaCalendarAlt className="me-2 text-primary" /> Posting Settings</h6>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Application Deadline <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="date" name="deadline" value={formData.deadline}
                        onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select name="status" value={formData.status} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="Closed">Closed</option>
                      </Form.Select>
                    </Form.Group>
                  </Card.Body>
                </Card>

                <Card className="preview-card mb-3">
                  <Card.Header>
                    <h6 className="mb-0">Live Preview</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="preview-header">
                      <div className="preview-avatar">
                        {formData.title ? formData.title.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'JB'}
                      </div>
                      <div>
                        <div className="preview-title">{formData.title || 'Job Title'}</div>
                        <div className="preview-dept">{formData.department || 'Department'}</div>
                      </div>
                    </div>
                    <div className="preview-info">
                      <div><FaMapMarkerAlt className="me-1" /> {formData.location || 'Location'}</div>
                      <div><FaBriefcase className="me-1" /> {formData.type}</div>
                      <div>
                        <FaDollarSign className="me-1" />
                        {formData.salaryMin && formData.salaryMax
                          ? `${formData.salaryMin} - ${formData.salaryMax}`
                          : 'Salary'}
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <div className="form-actions">
                  <Button variant="secondary" className="me-2" onClick={handleReset} disabled={loading}>
                    <FaTimes className="me-1" /> Reset
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <><Spinner animation="border" size="sm" className="me-2" />Creating...</>
                    ) : (
                      <><FaSave className="me-1" /> Create Job</>
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

export default AddJobPosting;
