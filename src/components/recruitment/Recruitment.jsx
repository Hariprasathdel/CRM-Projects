import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Modal, 
  Alert, 
  Spinner,
  Badge,
  Tabs,
  Tab,
  Form
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaDownload, 
  FaBriefcase, 
  FaUsers, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaSync
} from 'react-icons/fa';
import JobPostings from './JobPostings';
import ApplicantList from './ApplicantList';
import recruitmentService from '../../services/recruitmentService';
import './Recruitment.css';

const Recruitment = () => {
  const [loading, setLoading] = useState(false);
  const [savingJob, setSavingJob] = useState(false);
  const [jobPostings, setJobPostings] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [dbStatus, setDbStatus] = useState({ connected: true, host: 'Atlas Cluster' });
  const [filter, setFilter] = useState('all');

  // Form state for creating/editing job
  const [jobFormData, setJobFormData] = useState({
    title: '',
    department: 'Software Development',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    experience: '3+ years',
    salaryMin: '80000',
    salaryMax: '120000',
    description: '',
    requirements: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingJob) {
      setJobFormData({
        title: editingJob.title || '',
        department: editingJob.department || 'Software Development',
        location: editingJob.location || 'San Francisco, CA (Hybrid)',
        type: editingJob.type || 'Full-time',
        experience: editingJob.experience || '3+ years',
        salaryMin: editingJob.salaryMin || '80000',
        salaryMax: editingJob.salaryMax || '120000',
        description: editingJob.description || '',
        requirements: Array.isArray(editingJob.requirements) ? editingJob.requirements.join(', ') : (editingJob.requirements || ''),
        status: editingJob.status || 'Active'
      });
    } else {
      setJobFormData({
        title: '',
        department: 'Software Development',
        location: 'San Francisco, CA (Hybrid)',
        type: 'Full-time',
        experience: '3+ years',
        salaryMin: '80000',
        salaryMax: '120000',
        description: '',
        requirements: 'React, Node.js, MongoDB',
        status: 'Active'
      });
    }
  }, [editingJob]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Health check & DB status
      const health = await recruitmentService.checkHealth();
      if (health?.success && health.data?.database?.status === 'connected') {
        setDbStatus({ connected: true, host: health.data.database.host || 'Atlas Cluster' });
      }

      // 2. Fetch Jobs from MongoDB
      const res = await recruitmentService.getAllJobs();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setJobPostings(res.data.map(j => ({
          id: j._id || j.id,
          _id: j._id || j.id,
          title: j.jobTitle || j.title || 'Software Engineer',
          department: j.department || 'Software Development',
          location: j.workLocation || j.location || 'San Francisco, CA (Hybrid)',
          type: j.employmentType === 'full_time' ? 'Full-time' : (j.employmentType || 'Full-time'),
          experience: `${j.experienceRequired?.min || j.experienceRequired || 3}+ years`,
          salary: j.salaryRange?.min ? `$${j.salaryRange.min.toLocaleString()} - $${j.salaryRange.max.toLocaleString()}` : '$80,000 - $110,000',
          salaryMin: j.salaryRange?.min || 80000,
          salaryMax: j.salaryRange?.max || 120000,
          description: j.description || 'Enterprise role description',
          requirements: Array.isArray(j.requirements) ? j.requirements : ['Relevant experience', 'Strong communication'],
          status: j.status === 'open' ? 'Active' : (j.status || 'Active'),
          postedDate: j.postedDate ? new Date(j.postedDate).toISOString().split('T')[0] : (j.createdAt ? new Date(j.createdAt).toISOString().split('T')[0] : '2026-01-10'),
          applicants: j.applications || j.applicants || 0,
          deadline: j.closingDate ? new Date(j.closingDate).toISOString().split('T')[0] : '2026-06-30',
          avatar: (j.jobTitle || j.title || 'SE').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        })));
      }

      // 3. Fetch Applicants from MongoDB
      const appRes = await recruitmentService.getAllApplicants();
      if (appRes.success && Array.isArray(appRes.data?.data || appRes.data)) {
        const rawApplicants = appRes.data?.data || appRes.data;
        if (rawApplicants.length > 0) {
          setApplicants(rawApplicants.map(a => {
            const rawStatus = a.status || 'new';
            const displayStatus = 
              rawStatus === 'new' ? 'Pending' :
              rawStatus === 'screening' ? 'Pending' :
              rawStatus === 'shortlisted' ? 'Shortlisted' :
              rawStatus === 'interview_scheduled' || rawStatus === 'interviewed' || rawStatus === 'technical_round' ? 'Interview' :
              rawStatus === 'hired' ? 'Hired' :
              rawStatus === 'rejected' ? 'Rejected' :
              rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

            return {
              id: a._id || a.id,
              _id: a._id || a.id,
              name: a.fullName || `${a.firstName || ''} ${a.lastName || ''}`.trim() || 'Candidate',
              email: a.email || '',
              phone: a.phone || '',
              position: a.jobTitle || a.jobId?.jobTitle || a.position || 'Software Engineer',
              jobId: a.jobId?._id || a.jobId || '',
              experience: `${a.totalExperience || 3} years`,
              skills: Array.isArray(a.skills) && a.skills.length > 0 ? a.skills : ['Technical Knowledge', 'Collaboration'],
              status: displayStatus,
              appliedDate: a.appliedDate ? new Date(a.appliedDate).toISOString().split('T')[0] : '2026-01-10',
              resume: a.resume?.url || 'resume.pdf',
              avatar: ((a.firstName ? a.firstName[0] : '') + (a.lastName ? a.lastName[0] : 'C')).toUpperCase() || 'AJ'
            };
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching recruitment data:', err);
      setError('Failed to load recruitment data from MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!jobFormData.title.trim()) {
      setError('Job title is required');
      return;
    }

    setSavingJob(true);
    setError('');

    const requirementsList = typeof jobFormData.requirements === 'string'
      ? jobFormData.requirements.split(',').map(r => r.trim()).filter(Boolean)
      : jobFormData.requirements;

    const payload = {
      jobTitle: jobFormData.title,
      department: jobFormData.department,
      vacancies: 1,
      description: jobFormData.description || 'Enterprise role description',
      requirements: requirementsList.length > 0 ? requirementsList : ['Relevant experience'],
      workLocation: jobFormData.location,
      employmentType: jobFormData.type === 'Full-time' ? 'full_time' : 'contract',
      salaryRange: {
        min: Number(jobFormData.salaryMin) || 75000,
        max: Number(jobFormData.salaryMax) || 110000
      },
      status: jobFormData.status === 'Active' ? 'open' : 'closed'
    };

    try {
      if (editingJob) {
        const id = editingJob._id || editingJob.id;
        const res = await recruitmentService.updateJob(id, payload);
        if (res.success) {
          setSuccess('Job posting updated in MongoDB successfully!');
          setShowJobForm(false);
          setEditingJob(null);
          await fetchData();
        } else {
          setError(res.error?.message || 'Failed to update job posting');
        }
      } else {
        const res = await recruitmentService.createJob(payload);
        if (res.success) {
          setSuccess('Job posting created and stored in MongoDB successfully!');
          setShowJobForm(false);
          await fetchData();
        } else {
          setError(res.error?.message || 'Failed to create job posting');
        }
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Operation failed. Please try again.');
    } finally {
      setSavingJob(false);
    }
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting from MongoDB?')) {
      try {
        await recruitmentService.deleteJob(id);
        setJobPostings(prev => prev.filter(job => job.id !== id && job._id !== id));
        setSuccess('Job posting removed from MongoDB successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete job posting. Please try again.');
      }
    }
  };

  const handleViewApplicants = (job) => {
    setSelectedJob(job);
    setActiveTab('applicants');
  };

  const handleUpdateApplicantStatus = async (id, status) => {
    try {
      const res = await recruitmentService.updateApplicantStatus(id, status);
      if (res.success) {
        setApplicants(prev => prev.map(applicant => 
          (applicant.id === id || applicant._id === id) ? { ...applicant, status } : applicant
        ));
        setSuccess(`Applicant status updated to ${status}!`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(res.error?.message || 'Failed to update applicant status');
      }
    } catch (err) {
      setError('Failed to update applicant status. Please try again.');
    }
  };

  const handleDeleteApplicant = async (id) => {
    if (window.confirm('Are you sure you want to delete this applicant from MongoDB?')) {
      try {
        const res = await recruitmentService.deleteApplicant(id);
        if (res.success) {
          setApplicants(prev => prev.filter(applicant => applicant.id !== id && applicant._id !== id));
          setSuccess('Applicant deleted from MongoDB successfully!');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(res.error?.message || 'Failed to delete applicant from MongoDB');
        }
      } catch (err) {
        setError('Failed to delete applicant. Please try again.');
      }
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Title,Department,Location,Type,Status,Applicants\n"
      + jobPostings.map(j => `"${j.title}","${j.department}","${j.location}","${j.type}","${j.status}",${j.applicants}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `recruitment_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccess('Recruitment report exported as CSV!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Statistics
  const totalJobs = jobPostings.length;
  const activeJobs = jobPostings.filter(j => j.status === 'Active').length;
  const totalApplicants = applicants.length;
  const shortlisted = applicants.filter(a => a.status === 'Shortlisted').length;
  const interviewed = applicants.filter(a => a.status === 'Interview').length;
  const hired = applicants.filter(a => a.status === 'Hired').length;

  return (
    <div className="recruitment-page">
      <Container fluid>
        {/* Header Section */}
        <div className="recruitment-header">
          <div className="header-left">
            <div className="d-flex align-items-center gap-3 mb-1">
              <h2 className="page-title">Recruitment Management</h2>
              <div className={`db-status-badge ${dbStatus.connected ? 'connected' : 'disconnected'}`}>
                <span className="db-dot" />
                <span>{dbStatus.connected ? 'MongoDB Connected: Operational' : 'MongoDB Connecting...'}</span>
                <span className="text-muted ms-1">({dbStatus.host})</span>
              </div>
            </div>
            <p className="page-subtitle">Manage enterprise job postings and candidate pipelines stored in MongoDB Atlas</p>
          </div>
          <div className="header-right">
            <Button 
              variant="outline-primary" 
              className="me-2"
              onClick={fetchData}
              disabled={loading}
            >
              <FaSync className={`me-1 ${loading ? 'fa-spin' : ''}`} /> Refresh
            </Button>
            <Button 
              variant="primary" 
              className="me-2"
              onClick={() => {
                setEditingJob(null);
                setShowJobForm(true);
              }}
            >
              <FaPlus className="me-1" /> Post Job
            </Button>
            <Button variant="outline-secondary" onClick={handleExport}>
              <FaDownload className="me-1" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row className="statistics-cards mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card total-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper primary">
                    <FaBriefcase className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalJobs}</h3>
                    <p className="stat-label">Total Jobs</p>
                    <small className="stat-detail">{activeJobs} active positions in MongoDB</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card applicants-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper info">
                    <FaUsers className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalApplicants}</h3>
                    <p className="stat-label">Total Applicants</p>
                    <small className="stat-detail">Live from MongoDB</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card shortlisted-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper warning">
                    <FaClock className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{shortlisted + interviewed}</h3>
                    <p className="stat-label">In Pipeline</p>
                    <small className="stat-detail">{shortlisted} shortlisted, {interviewed} interviewing</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card hired-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper success">
                    <FaCheckCircle className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{hired}</h3>
                    <p className="stat-label">Hired</p>
                    <small className="stat-detail">Successful placements</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Alerts */}
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" onClose={() => setSuccess('')} dismissible>
            {success}
          </Alert>
        )}

        {/* Tabs */}
        <Card className="recruitment-main-card">
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => {
                setActiveTab(k);
                if (k === 'jobs') setSelectedJob(null);
              }}
              className="recruitment-tabs mb-3"
            >
              <Tab eventKey="jobs" title={
                <span>
                  <FaBriefcase className="me-2" />
                  Job Postings ({jobPostings.length})
                </span>
              }>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Loading job postings from MongoDB...</p>
                  </div>
                ) : (
                  <JobPostings 
                    jobs={jobPostings}
                    onViewApplicants={handleViewApplicants}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteJob}
                    setShowForm={setShowJobForm}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filter={filter}
                    setFilter={setFilter}
                  />
                )}
              </Tab>
              
              <Tab eventKey="applicants" title={
                <span>
                  <FaUsers className="me-2" />
                  Applicants ({applicants.length})
                </span>
              }>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Loading applicants from MongoDB...</p>
                  </div>
                ) : (
                  <ApplicantList 
                    applicants={applicants}
                    onUpdateStatus={handleUpdateApplicantStatus}
                    onDelete={handleDeleteApplicant}
                    selectedJob={selectedJob}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filter={filter}
                    setFilter={setFilter}
                  />
                )}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        {/* Interactive Job Form Modal */}
        <Modal 
          show={showJobForm} 
          onHide={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
          size="lg"
          centered
        >
          <Form onSubmit={handleFormSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>
                <FaBriefcase className="me-2" />
                {editingJob ? 'Edit Job Posting' : 'Post New Job to MongoDB'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Job Title <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. Senior Full Stack Engineer"
                      value={jobFormData.title}
                      onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Department <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={jobFormData.department}
                      onChange={(e) => setJobFormData({ ...jobFormData, department: e.target.value })}
                    >
                      <option value="Software Development">Software Development</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Production">Production</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. San Francisco, CA (Hybrid)"
                      value={jobFormData.location}
                      onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Employment Type</Form.Label>
                    <Form.Select
                      value={jobFormData.type}
                      onChange={(e) => setJobFormData({ ...jobFormData, type: e.target.value })}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Min Salary ($)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="80000"
                      value={jobFormData.salaryMin}
                      onChange={(e) => setJobFormData({ ...jobFormData, salaryMin: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Max Salary ($)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="120000"
                      value={jobFormData.salaryMax}
                      onChange={(e) => setJobFormData({ ...jobFormData, salaryMax: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Detailed responsibilities and role summary..."
                      value={jobFormData.description}
                      onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Requirements (comma separated)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. React, Node.js, MongoDB, TypeScript"
                      value={jobFormData.requirements}
                      onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={jobFormData.status}
                      onChange={(e) => setJobFormData({ ...jobFormData, status: e.target.value })}
                    >
                      <option value="Active">Active / Open</option>
                      <option value="Closed">Closed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowJobForm(false);
                  setEditingJob(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={savingJob}
              >
                {savingJob ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-1" />
                    Saving to MongoDB...
                  </>
                ) : (
                  editingJob ? 'Save Changes' : 'Publish Job'
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default Recruitment;